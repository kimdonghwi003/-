-- =============================================================
--  VocalAI — 곡 파일 저장 & 보컬 분석 결과 스키마
--  Supabase (PostgreSQL) 전용
--  생성일: 2026-06-19
-- =============================================================
-- ※ 사전 준비: Supabase 대시보드 → Storage → New bucket
--    이름: songs  /  Public bucket: ON

-- updated_at 자동 갱신 함수 (schema.sql에 없는 경우 실행)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;


-- =============================================================
-- 1. 곡 파일 마스터 테이블
-- =============================================================
CREATE TABLE IF NOT EXISTS song_files (
    id                      BIGSERIAL       PRIMARY KEY,

    -- 파일 정보
    file_name               VARCHAR(255)    NOT NULL,           -- 원본 파일명
    storage_path            VARCHAR(512),                       -- Storage 경로: songs/<uuid>/<file_name>
    public_url              TEXT,                               -- Supabase Public URL
    file_size_bytes         BIGINT,
    file_format             VARCHAR(10)     CHECK (file_format IN ('mp3','wav','m4a','ogg')),
    duration_seconds        NUMERIC(10,2),

    -- 곡 메타데이터 (선택, 나중에 채울 수 있음)
    title                   VARCHAR(255),
    artist                  VARCHAR(255),
    genre                   VARCHAR(100),

    -- 분석 상태
    analysis_status         VARCHAR(20)     NOT NULL DEFAULT 'pending',
    -- pending | processing | completed | failed
    analysis_engine         VARCHAR(50),                        -- 'browser-hps-v2' | 'spleeter-v1' | 'demucs-v4'
    analyzed_at             TIMESTAMPTZ,

    -- ── 보컬 분석 결과 ──────────────────────────────────────
    vocal_highest_note      VARCHAR(10),                        -- 예: 'A5'
    vocal_lowest_note       VARCHAR(10),                        -- 예: 'C3'
    vocal_highest_midi      SMALLINT,                           -- MIDI 번호 (69 = A4)
    vocal_lowest_midi       SMALLINT,
    vocal_range_semitones   SMALLINT,                           -- 음역대 (반음 수)

    -- 난이도
    difficulty              VARCHAR(10)     CHECK (difficulty IN ('easy','medium','hard')),
    difficulty_label        VARCHAR(30),                        -- '하 (쉬움)' | '중 (보통)' | '상 (어려움)'

    -- 상세 분석 데이터 (JSON)
    analysis_data           JSONB,
    -- 예시:
    -- {
    --   "sample_points": [0.25, 0.40, ...],
    --   "detected_midis": [72, 74, 76, 79],
    --   "confidence_scores": [0.91, 0.87, ...],
    --   "vocal_channel": "center",
    --   "method": "hps"
    -- }

    error_message           TEXT,

    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER trg_song_files_updated_at
  BEFORE UPDATE ON song_files
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_sf_status        ON song_files (analysis_status);
CREATE INDEX IF NOT EXISTS idx_sf_difficulty    ON song_files (difficulty);
CREATE INDEX IF NOT EXISTS idx_sf_highest_midi  ON song_files (vocal_highest_midi DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_sf_file_name     ON song_files (file_name);


-- =============================================================
-- 2. Row Level Security (RLS)
-- =============================================================
ALTER TABLE song_files ENABLE ROW LEVEL SECURITY;

-- 읽기: 전체 공개 (분석 결과 열람)
CREATE POLICY "public_read" ON song_files
  FOR SELECT USING (true);

-- 쓰기: 인증된 사용자만 (Supabase Auth 사용 시)
CREATE POLICY "auth_insert" ON song_files
  FOR INSERT WITH CHECK (true);   -- 필요 시 auth.uid() IS NOT NULL 로 변경

CREATE POLICY "auth_update" ON song_files
  FOR UPDATE USING (true);

CREATE POLICY "auth_delete" ON song_files
  FOR DELETE USING (true);


-- =============================================================
-- 3. 분석 요약 뷰
-- =============================================================
CREATE OR REPLACE VIEW song_analysis_summary AS
SELECT
    COUNT(*)                                                    AS total_songs,
    COUNT(*) FILTER (WHERE analysis_status = 'completed')       AS analyzed_count,
    COUNT(*) FILTER (WHERE analysis_status = 'pending')         AS pending_count,
    COUNT(*) FILTER (WHERE analysis_status = 'failed')          AS failed_count,
    COUNT(*) FILTER (WHERE difficulty = 'easy')                 AS easy_count,
    COUNT(*) FILTER (WHERE difficulty = 'medium')               AS medium_count,
    COUNT(*) FILTER (WHERE difficulty = 'hard')                 AS hard_count,
    MAX(vocal_highest_midi)                                     AS max_highest_midi,
    MIN(vocal_lowest_midi)                                      AS min_lowest_midi,
    ROUND(AVG(vocal_range_semitones)::NUMERIC, 1)               AS avg_range_semitones,
    MAX(vocal_highest_note)                                     AS top_note
FROM song_files;


-- =============================================================
-- 4. 난이도별 곡 목록 조회 예시 (앱에서 사용)
-- =============================================================
-- 어려운 곡 목록 (최고음 높은 순)
-- SELECT id, file_name, title, artist, vocal_highest_note, vocal_range_semitones, difficulty_label
-- FROM song_files
-- WHERE analysis_status = 'completed' AND difficulty = 'hard'
-- ORDER BY vocal_highest_midi DESC;

-- 특정 음역 이하의 쉬운 곡 목록
-- SELECT *
-- FROM song_files
-- WHERE vocal_highest_midi <= 72   -- C5 이하
--   AND analysis_status = 'completed'
-- ORDER BY vocal_range_semitones DESC;


-- =============================================================
-- 5. Supabase Storage 버킷 정책 (SQL Editor에서 실행)
-- =============================================================
-- ※ 버킷은 대시보드 UI에서 생성 권장, 아래는 Storage Policy SQL

-- 전체 읽기 허용 (Public 버킷)
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

-- 업로드 정책: 인증 사용자
CREATE POLICY "allow_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'songs');

-- 다운로드/읽기 정책: 전체 공개
CREATE POLICY "allow_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'songs');

-- 삭제 정책: 인증 사용자
CREATE POLICY "allow_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'songs');


-- =============================================================
-- 6. 브라우저 → Supabase 업로드 흐름 (참고용 코드)
-- =============================================================
-- 아래는 Supabase JS 클라이언트 사용 예시 (app.js에 추가 시)
--
-- const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
--
-- // 1) Storage에 파일 업로드
-- const { data: uploadData, error: uploadErr } = await supabase.storage
--   .from('songs')
--   .upload(`${Date.now()}_${file.name}`, file, { contentType: 'audio/mpeg' });
--
-- // 2) Public URL 조회
-- const { data: urlData } = supabase.storage
--   .from('songs')
--   .getPublicUrl(uploadData.path);
--
-- // 3) song_files 테이블에 레코드 삽입
-- await supabase.from('song_files').insert({
--   file_name:         file.name,
--   storage_path:      uploadData.path,
--   public_url:        urlData.publicUrl,
--   file_size_bytes:   file.size,
--   file_format:       file.name.split('.').pop().toLowerCase(),
--   analysis_status:   'pending'
-- });
--
-- // 4) 분석 완료 후 업데이트
-- await supabase.from('song_files').update({
--   analysis_status:      'completed',
--   analysis_engine:      'browser-hps-v2',
--   analyzed_at:          new Date().toISOString(),
--   vocal_highest_note:   result.highestNote,
--   vocal_lowest_note:    result.lowestNote,
--   vocal_highest_midi:   result.highestMidi,
--   vocal_lowest_midi:    result.lowestMidi,
--   vocal_range_semitones:result.rangeSemitones,
--   difficulty:           result.difficulty.key,
--   difficulty_label:     result.difficulty.label,
--   duration_seconds:     result.duration,
--   analysis_data:        result.rawData
-- }).eq('id', recordId);
