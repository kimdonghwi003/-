-- ================================================================
--  VocalAI Songs Library Schema
--  대상: Supabase (PostgreSQL)
--  용도: MP3 수백 곡 저장 + AI 보컬 분리 분석 결과 관리
--  실행 순서: Supabase SQL Editor에 전체 붙여넣기 후 실행
-- ================================================================

-- ── 공통 트리거 함수
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 1. Supabase Storage 버킷 생성
--    (이미 생성되어 있으면 무시)
-- ================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'songs',
  'songs',
  false,
  209715200,  -- 200MB per file
  ARRAY['audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/m4a','audio/x-m4a','audio/ogg','audio/aac']
)
ON CONFLICT (id) DO NOTHING;

-- 분리된 보컬 트랙 저장 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('vocals', 'vocals', false, 209715200)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 2. 곡 라이브러리 테이블 (원본 MP3 메타데이터)
-- ================================================================
CREATE TABLE IF NOT EXISTS songs_library (
    id                  BIGSERIAL           PRIMARY KEY,
    title               VARCHAR(255),
    original_filename   VARCHAR(255)        NOT NULL,
    storage_path        VARCHAR(512)        NOT NULL UNIQUE,
    storage_url         TEXT,
    file_size_bytes     BIGINT,
    duration_seconds    NUMERIC(8, 2),
    file_format         VARCHAR(10)         CHECK (file_format IN ('mp3','wav','m4a','ogg','aac')),
    genre               VARCHAR(100),
    artist              VARCHAR(255),
    status              VARCHAR(20)         NOT NULL DEFAULT 'uploaded'
                        CHECK (status IN ('uploaded','queued','analyzing','completed','failed')),
    error_message       TEXT,
    uploaded_at         TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_songs_library_updated_at
  BEFORE UPDATE ON songs_library
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_sl_status   ON songs_library (status);
CREATE INDEX IF NOT EXISTS idx_sl_genre    ON songs_library (genre);
CREATE INDEX IF NOT EXISTS idx_sl_artist   ON songs_library (artist);
CREATE INDEX IF NOT EXISTS idx_sl_uploaded ON songs_library (uploaded_at);

-- ================================================================
-- 3. AI 보컬 분석 결과 테이블
--    (Demucs 보컬 분리 → CREPE 피치 검출 결과)
-- ================================================================
CREATE TABLE IF NOT EXISTS vocal_analysis_results (
    id                  BIGSERIAL           PRIMARY KEY,
    song_id             BIGINT              NOT NULL UNIQUE
                        REFERENCES songs_library(id) ON DELETE CASCADE,

    -- 보컬 트랙 경로 (Demucs 분리 결과)
    vocal_storage_path  VARCHAR(512),
    vocal_url           TEXT,

    -- 핵심 분석 결과
    highest_note        VARCHAR(10),        -- 예: 'G#5'
    highest_hz          NUMERIC(10, 4),     -- 예: 830.6094
    highest_midi        INTEGER,            -- 예: 80

    lowest_note         VARCHAR(10),
    lowest_hz           NUMERIC(10, 4),
    lowest_midi         INTEGER,

    -- 95번째 백분위 최고음 (순간 최고음이 아닌 "지속 최고음")
    -- 보컬리스트가 실제로 낼 수 있는 최고음에 더 가까움
    p95_note            VARCHAR(10),
    p95_hz              NUMERIC(10, 4),
    p95_midi            INTEGER,

    range_semitones     INTEGER,            -- 음역대 (반음 수)
    difficulty          VARCHAR(20),        -- '상 (어려움)' / '중 (보통)' / '하 (쉬움)'
    pitch_confidence    NUMERIC(5, 4),      -- CREPE 평균 신뢰도 (0~1)
    voiced_ratio        NUMERIC(5, 4),      -- 유성음 비율

    -- 상세 데이터 (JSON)
    pitch_histogram     JSONB,              -- 음정 분포 히스토그램
    raw_pitch_data      JSONB,              -- 시간별 주파수 배열 (샘플링)

    analyzer            VARCHAR(100),       -- 'demucs_mdx_extra+crepe_full'
    processing_time_ms  INTEGER,
    error_message       TEXT,
    analyzed_at         TIMESTAMPTZ         DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_var_song_id   ON vocal_analysis_results (song_id);
CREATE INDEX IF NOT EXISTS idx_var_diff      ON vocal_analysis_results (difficulty);
CREATE INDEX IF NOT EXISTS idx_var_p95_midi  ON vocal_analysis_results (p95_midi);

-- ================================================================
-- 4. 분석 대기열 테이블 (벌크 분석 작업 관리)
-- ================================================================
CREATE TABLE IF NOT EXISTS analysis_queue (
    id              BIGSERIAL           PRIMARY KEY,
    song_id         BIGINT              NOT NULL UNIQUE
                    REFERENCES songs_library(id) ON DELETE CASCADE,
    priority        SMALLINT            NOT NULL DEFAULT 5,   -- 1(높음)~10(낮음)
    queued_at       TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    worker_id       VARCHAR(100),
    retry_count     SMALLINT            NOT NULL DEFAULT 0,
    max_retries     SMALLINT            NOT NULL DEFAULT 3
);

CREATE INDEX IF NOT EXISTS idx_queue_priority ON analysis_queue (priority, queued_at);

-- ================================================================
-- 5. Row Level Security (RLS) 설정
-- ================================================================

-- songs_library
ALTER TABLE songs_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "songs_library_all" ON songs_library
  FOR ALL USING (true) WITH CHECK (true);

-- vocal_analysis_results
ALTER TABLE vocal_analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vocal_analysis_all" ON vocal_analysis_results
  FOR ALL USING (true) WITH CHECK (true);

-- analysis_queue
ALTER TABLE analysis_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analysis_queue_all" ON analysis_queue
  FOR ALL USING (true) WITH CHECK (true);

-- ================================================================
-- 6. Supabase Storage RLS
-- ================================================================

-- songs 버킷: 업로드/다운로드 허용
DO $$ BEGIN
  CREATE POLICY "songs_upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'songs');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "songs_select" ON storage.objects
    FOR SELECT USING (bucket_id = 'songs');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "songs_delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'songs');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- vocals 버킷: 업로드/다운로드 허용
DO $$ BEGIN
  CREATE POLICY "vocals_upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'vocals');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "vocals_select" ON storage.objects
    FOR SELECT USING (bucket_id = 'vocals');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ================================================================
-- 7. 편의 뷰: 분석 결과 통합 조회
-- ================================================================
CREATE OR REPLACE VIEW songs_analysis_view AS
SELECT
    sl.id,
    sl.title,
    sl.original_filename,
    sl.artist,
    sl.genre,
    sl.duration_seconds,
    sl.file_size_bytes,
    sl.storage_url,
    sl.status,
    sl.uploaded_at,
    var.highest_note,
    var.highest_hz,
    var.highest_midi,
    var.lowest_note,
    var.p95_note             AS sustained_highest_note,
    var.p95_midi,
    var.range_semitones,
    var.difficulty,
    var.pitch_confidence,
    var.voiced_ratio,
    var.vocal_url,
    var.analyzer,
    var.processing_time_ms,
    var.error_message        AS analysis_error,
    var.analyzed_at
FROM songs_library sl
LEFT JOIN vocal_analysis_results var ON sl.id = var.song_id
ORDER BY sl.id;

-- ================================================================
-- 8. 함수: 다음 분석 대기 곡 가져오기 (백엔드 서버 폴링용)
-- ================================================================
CREATE OR REPLACE FUNCTION dequeue_next_song()
RETURNS TABLE(queue_id BIGINT, song_id BIGINT, storage_path TEXT, storage_url TEXT)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
    UPDATE analysis_queue q
    SET started_at = NOW(),
        worker_id  = gen_random_uuid()::text
    FROM songs_library sl
    WHERE q.song_id = sl.id
      AND q.started_at IS NULL
      AND q.retry_count < q.max_retries
    ORDER BY q.priority, q.queued_at
    LIMIT 1
    RETURNING q.id, q.song_id, sl.storage_path, sl.storage_url;
END;
$$;
