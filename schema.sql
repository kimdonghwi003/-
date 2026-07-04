-- =============================================================
--  VocalAI – 데이터베이스 스키마 (PostgreSQL / Supabase 호환)
--  MySQL → PostgreSQL 완전 변환
--  생성일: 2026-06-17
-- =============================================================

-- ── UUID 확장 (Supabase 기본 활성화)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- 0. updated_at 자동 갱신 트리거 함수
-- =============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- 1. ENUM 타입 정의
-- =============================================================

-- 이미 타입이 존재할 경우 오류 방지
DO $$ BEGIN
  CREATE TYPE account_type     AS ENUM ('student', 'trainer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE oauth_provider   AS ENUM ('kakao', 'google', 'none');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE approval_status  AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE rec_type         AS ENUM ('achievable', 'challenge');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status   AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status   AS ENUM ('pending', 'paid', 'cancelled', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE pg_provider_type AS ENUM ('toss', 'portone', 'kakao');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE settlement_status AS ENUM ('pending', 'settled', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE reporter_type    AS ENUM ('student', 'trainer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_target_type AS ENUM ('review', 'submission', 'trainer', 'student');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_status    AS ENUM ('pending', 'resolved', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE recipient_type   AS ENUM ('student', 'trainer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE cancelled_by_type AS ENUM ('student', 'trainer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE deletion_reason_type AS ENUM ('scheduled_24h', 'manual', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- 2. 계정 / 인증 테이블
-- =============================================================

-- ▶ 이메일 전역 중복 방지 (학생·트레이너 동일 이메일 가입 차단)
CREATE TABLE IF NOT EXISTS global_emails (
    email           VARCHAR(255)    NOT NULL PRIMARY KEY,
    account_type    account_type    NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ▶ 학생 계정
CREATE TABLE IF NOT EXISTS students (
    id                  BIGSERIAL       PRIMARY KEY,
    email               VARCHAR(255)    NOT NULL UNIQUE,
    password_hash       VARCHAR(255),
    nickname            VARCHAR(50)     NOT NULL,
    profile_image_url   VARCHAR(512),
    preferred_genres    JSONB,                          -- ["발라드","팝","R&B"]
    oauth_provider      oauth_provider  NOT NULL DEFAULT 'none',
    oauth_uid           VARCHAR(255),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    email_verified_at   TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (oauth_provider, oauth_uid)
);

CREATE TRIGGER trg_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ▶ 트레이너 계정
CREATE TABLE IF NOT EXISTS trainers (
    id                  BIGSERIAL       PRIMARY KEY,
    email               VARCHAR(255)    NOT NULL UNIQUE,
    password_hash       VARCHAR(255),
    name                VARCHAR(100)    NOT NULL,
    profile_image_url   VARCHAR(512),
    introduction        TEXT,
    career_years        SMALLINT        NOT NULL DEFAULT 0,
    lesson_price        INTEGER         NOT NULL DEFAULT 0,       -- 원/시간
    specialties         JSONB,                                    -- ["고음처리","호흡"]
    approval_status     approval_status NOT NULL DEFAULT 'pending',
    approved_at         TIMESTAMPTZ,
    rejection_reason    TEXT,
    oauth_provider      oauth_provider  NOT NULL DEFAULT 'none',
    oauth_uid           VARCHAR(255),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    email_verified_at   TIMESTAMPTZ,
    average_rating      NUMERIC(3,2)    NOT NULL DEFAULT 0.00,
    total_reviews       INTEGER         NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (oauth_provider, oauth_uid)
);

CREATE TRIGGER trg_trainers_updated_at
  BEFORE UPDATE ON trainers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ▶ 관리자 계정
CREATE TABLE IF NOT EXISTS admins (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ▶ 이메일 인증 토큰
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL,
    token           VARCHAR(255)    NOT NULL UNIQUE,
    account_type    account_type    NOT NULL,
    expires_at      TIMESTAMPTZ     NOT NULL,
    used_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evt_email ON email_verification_tokens (email);
CREATE INDEX IF NOT EXISTS idx_evt_token ON email_verification_tokens (token);

-- ▶ 비밀번호 재설정 토큰
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL,
    account_type    account_type    NOT NULL,
    token           VARCHAR(255)    NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ     NOT NULL,
    used_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prt_email ON password_reset_tokens (email);


-- =============================================================
-- 3. 음성 파일 업로드 & 분석 요청
-- =============================================================

-- ▶ 음성 업로드 세션 (비회원 포함)
CREATE TABLE IF NOT EXISTS vocal_submissions (
    id                      BIGSERIAL           PRIMARY KEY,
    student_id              BIGINT              REFERENCES students(id) ON DELETE SET NULL,
    guest_email             VARCHAR(255),
    original_file_url       VARCHAR(512)        NOT NULL,
    file_name               VARCHAR(255)        NOT NULL,
    file_format             VARCHAR(10)         NOT NULL CHECK (file_format IN ('mp3','wav','m4a','ogg')),
    file_size_bytes         INTEGER             NOT NULL,
    requirements_text       TEXT,
    target_song             VARCHAR(255),
    status                  submission_status   NOT NULL DEFAULT 'pending',
    access_token            VARCHAR(255)        UNIQUE,
    access_token_expires_at TIMESTAMPTZ,
    scheduled_delete_at     TIMESTAMPTZ,
    deleted_at              TIMESTAMPTZ,
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_vocal_submissions_updated_at
  BEFORE UPDATE ON vocal_submissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_vs_student ON vocal_submissions (student_id);
CREATE INDEX IF NOT EXISTS idx_vs_status  ON vocal_submissions (status);
CREATE INDEX IF NOT EXISTS idx_vs_delete  ON vocal_submissions (scheduled_delete_at);

-- ▶ AI 보컬 분석 결과
CREATE TABLE IF NOT EXISTS vocal_analysis_results (
    id                  BIGSERIAL       PRIMARY KEY,
    submission_id       BIGINT          NOT NULL UNIQUE REFERENCES vocal_submissions(id) ON DELETE CASCADE,
    pitch_score         SMALLINT        NOT NULL DEFAULT 0 CHECK (pitch_score  BETWEEN 0 AND 100),
    rhythm_score        SMALLINT        NOT NULL DEFAULT 0 CHECK (rhythm_score BETWEEN 0 AND 100),
    volume_score        SMALLINT        NOT NULL DEFAULT 0 CHECK (volume_score BETWEEN 0 AND 100),
    timbre_score        SMALLINT        NOT NULL DEFAULT 0 CHECK (timbre_score BETWEEN 0 AND 100),
    overall_score       SMALLINT        NOT NULL DEFAULT 0 CHECK (overall_score BETWEEN 0 AND 100),
    lowest_note         VARCHAR(10),                    -- C3
    highest_note        VARCHAR(10),                    -- A4
    pitch_feedback      TEXT,
    rhythm_feedback     TEXT,
    volume_feedback     TEXT,
    timbre_feedback     TEXT,
    overall_feedback    TEXT,
    weak_areas          JSONB,                          -- ["고음처리","호흡"]
    chart_data          JSONB,
    trainer_feedback    TEXT,                           -- 트레이너 총괄 피드백 내용
    trainer_id          BIGINT          REFERENCES trainers(id) ON DELETE SET NULL,
    satisfaction_rating SMALLINT        CHECK (satisfaction_rating BETWEEN 1 AND 5), -- 수강생의 피드백 별점 만족도 (1~5점)
    satisfaction_comment TEXT,                          -- 만족도 평가 한줄평
    satisfaction_rated_at TIMESTAMPTZ,                  -- 만족도 평가 일시
    json_data           JSONB,                          -- 프론트엔드 전체 분석 데이터 호환용
    analysis_engine     VARCHAR(100),
    processing_time_ms  INTEGER,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_var_submission ON vocal_analysis_results (submission_id);


-- =============================================================
-- 4. 곡 데이터베이스 & 추천
-- =============================================================

-- ▶ 곡 마스터
CREATE TABLE IF NOT EXISTS songs (
    id              BIGSERIAL       PRIMARY KEY,
    title           VARCHAR(255)    NOT NULL,
    artist          VARCHAR(255)    NOT NULL,
    genre           VARCHAR(100)    NOT NULL,
    lowest_note     VARCHAR(20)     NOT NULL,
    highest_note    VARCHAR(20)     NOT NULL,
    difficulty      difficulty_level NOT NULL DEFAULT 'medium',
    difficulty_score SMALLINT       NOT NULL DEFAULT 5,
    highest_midi    SMALLINT        NOT NULL DEFAULT 60,
    gender          VARCHAR(10)     NOT NULL DEFAULT 'X',
    emoji           VARCHAR(10)     NOT NULL DEFAULT '🎵',
    album_art_url   VARCHAR(512),
    youtube_url     VARCHAR(512),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 기존 테이블이 존재할 경우를 대비한 컬럼 추가 구문
ALTER TABLE songs ADD COLUMN IF NOT EXISTS difficulty_score SMALLINT DEFAULT 5;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS highest_midi SMALLINT DEFAULT 60;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS gender VARCHAR(10) DEFAULT 'X';
ALTER TABLE songs ADD COLUMN IF NOT EXISTS emoji VARCHAR(10) DEFAULT '🎵';
ALTER TABLE songs ALTER COLUMN lowest_note TYPE VARCHAR(20);
ALTER TABLE songs ALTER COLUMN highest_note TYPE VARCHAR(20);

CREATE TRIGGER trg_songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_songs_genre      ON songs (genre);
CREATE INDEX IF NOT EXISTS idx_songs_difficulty ON songs (difficulty);

-- ▶ 곡 추천 결과
CREATE TABLE IF NOT EXISTS song_recommendations (
    id                  BIGSERIAL       PRIMARY KEY,
    student_id          BIGINT          NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    analysis_id         BIGINT          NOT NULL REFERENCES vocal_analysis_results(id) ON DELETE CASCADE,
    song_id             BIGINT          NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    recommendation_type rec_type        NOT NULL,
    is_saved            BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sr_student ON song_recommendations (student_id);


-- =============================================================
-- 5. MR 제작 & 키 조절
-- =============================================================

CREATE TABLE IF NOT EXISTS mr_requests (
    id                  BIGSERIAL           PRIMARY KEY,
    student_id          BIGINT              NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    original_file_url   VARCHAR(512)        NOT NULL,
    original_file_name  VARCHAR(255)        NOT NULL,
    copyright_agreed    BOOLEAN             NOT NULL DEFAULT FALSE,
    copyright_agreed_at TIMESTAMPTZ,
    key_shift           SMALLINT            NOT NULL DEFAULT 0 CHECK (key_shift BETWEEN -6 AND 6),
    status              submission_status   NOT NULL DEFAULT 'pending',
    mr_file_url         VARCHAR(512),
    processing_time_ms  INTEGER,
    error_message       TEXT,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_mr_requests_updated_at
  BEFORE UPDATE ON mr_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_mr_student ON mr_requests (student_id);
CREATE INDEX IF NOT EXISTS idx_mr_status  ON mr_requests (status);


-- =============================================================
-- 6. 트레이너 스케줄
-- =============================================================

CREATE TABLE IF NOT EXISTS trainer_schedules (
    id              BIGSERIAL       PRIMARY KEY,
    trainer_id      BIGINT          NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    available_date  DATE            NOT NULL,
    start_time      TIME            NOT NULL,
    end_time        TIME            NOT NULL,
    is_booked       BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_trainer_schedules_updated_at
  BEFORE UPDATE ON trainer_schedules
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_ts_trainer_date ON trainer_schedules (trainer_id, available_date);


-- =============================================================
-- 7. 트레이너 매칭 & 레슨 예약
-- =============================================================

CREATE TABLE IF NOT EXISTS lesson_bookings (
    id                  BIGSERIAL           PRIMARY KEY,
    student_id          BIGINT              NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    trainer_id          BIGINT              NOT NULL REFERENCES trainers(id) ON DELETE RESTRICT,
    analysis_id         BIGINT              REFERENCES vocal_analysis_results(id) ON DELETE SET NULL,
    schedule_id         BIGINT              REFERENCES trainer_schedules(id) ON DELETE SET NULL,
    status              booking_status      NOT NULL DEFAULT 'pending',
    lesson_date         DATE,
    lesson_start_time   TIME,
    lesson_end_time     TIME,
    lesson_link         VARCHAR(512),
    student_note        TEXT,
    trainer_note        TEXT,
    cancelled_at        TIMESTAMPTZ,
    cancelled_by        cancelled_by_type,
    cancel_reason       TEXT,
    completed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_lesson_bookings_updated_at
  BEFORE UPDATE ON lesson_bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_lb_student ON lesson_bookings (student_id);
CREATE INDEX IF NOT EXISTS idx_lb_trainer ON lesson_bookings (trainer_id);
CREATE INDEX IF NOT EXISTS idx_lb_status  ON lesson_bookings (status);


-- =============================================================
-- 8. 결제 & 정산
-- =============================================================

-- ▶ 결제 내역
CREATE TABLE IF NOT EXISTS payments (
    id                  BIGSERIAL           PRIMARY KEY,
    booking_id          BIGINT              NOT NULL REFERENCES lesson_bookings(id) ON DELETE RESTRICT,
    student_id          BIGINT              NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    pg_provider         pg_provider_type    NOT NULL DEFAULT 'toss',
    pg_transaction_id   VARCHAR(255)        NOT NULL UNIQUE,
    pg_order_id         VARCHAR(255)        NOT NULL UNIQUE,
    amount              INTEGER             NOT NULL CHECK (amount >= 0),
    status              payment_status      NOT NULL DEFAULT 'pending',
    paid_at             TIMESTAMPTZ,
    cancelled_at        TIMESTAMPTZ,
    refund_amount       INTEGER             NOT NULL DEFAULT 0,
    refunded_at         TIMESTAMPTZ,
    failure_reason      TEXT,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_pay_student ON payments (student_id);
CREATE INDEX IF NOT EXISTS idx_pay_status  ON payments (status);

-- ▶ 트레이너 정산
CREATE TABLE IF NOT EXISTS trainer_settlements (
    id                  BIGSERIAL           PRIMARY KEY,
    trainer_id          BIGINT              NOT NULL REFERENCES trainers(id) ON DELETE RESTRICT,
    payment_id          BIGINT              NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    gross_amount        INTEGER             NOT NULL CHECK (gross_amount >= 0),
    commission_rate     NUMERIC(5,2)        NOT NULL DEFAULT 20.00,
    commission_amount   INTEGER             NOT NULL CHECK (commission_amount >= 0),
    net_amount          INTEGER             NOT NULL CHECK (net_amount >= 0),
    status              settlement_status   NOT NULL DEFAULT 'pending',
    settled_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_trainer_settlements_updated_at
  BEFORE UPDATE ON trainer_settlements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_tset_trainer ON trainer_settlements (trainer_id);
CREATE INDEX IF NOT EXISTS idx_tset_status  ON trainer_settlements (status);


-- =============================================================
-- 9. 리뷰
-- =============================================================

CREATE TABLE IF NOT EXISTS lesson_reviews (
    id              BIGSERIAL       PRIMARY KEY,
    booking_id      BIGINT          NOT NULL UNIQUE REFERENCES lesson_bookings(id) ON DELETE CASCADE,
    student_id      BIGINT          NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    trainer_id      BIGINT          NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    rating          SMALLINT        NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content         TEXT,
    is_hidden       BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_lesson_reviews_updated_at
  BEFORE UPDATE ON lesson_reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_lr_trainer ON lesson_reviews (trainer_id);


-- =============================================================
-- 10. 알림
-- =============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id              BIGSERIAL       PRIMARY KEY,
    recipient_type  recipient_type  NOT NULL,
    recipient_id    BIGINT          NOT NULL,
    type            VARCHAR(100)    NOT NULL,
    title           VARCHAR(255)    NOT NULL,
    body            TEXT,
    link_url        VARCHAR(512),
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_recipient ON notifications (recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notif_read      ON notifications (is_read);


-- =============================================================
-- 11. 신고
-- =============================================================

CREATE TABLE IF NOT EXISTS reports (
    id              BIGSERIAL           PRIMARY KEY,
    reporter_type   reporter_type       NOT NULL,
    reporter_id     BIGINT              NOT NULL,
    target_type     report_target_type  NOT NULL,
    target_id       BIGINT              NOT NULL,
    reason          TEXT                NOT NULL,
    status          report_status       NOT NULL DEFAULT 'pending',
    admin_id        BIGINT              REFERENCES admins(id) ON DELETE SET NULL,
    admin_note      TEXT,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);


-- =============================================================
-- 12. 시스템 / 감사 로그
-- =============================================================

-- ▶ 파일 삭제 로그
CREATE TABLE IF NOT EXISTS file_deletion_logs (
    id              BIGSERIAL               PRIMARY KEY,
    submission_id   BIGINT                  NOT NULL,
    file_url        VARCHAR(512)            NOT NULL,
    deleted_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    deletion_reason deletion_reason_type    NOT NULL DEFAULT 'scheduled_24h'
);

-- ▶ 관리자 감사 로그
CREATE TABLE IF NOT EXISTS audit_logs (
    id              BIGSERIAL       PRIMARY KEY,
    admin_id        BIGINT          NOT NULL REFERENCES admins(id) ON DELETE RESTRICT,
    action          VARCHAR(255)    NOT NULL,
    target_type     VARCHAR(100),
    target_id       BIGINT,
    detail          JSONB,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin  ON audit_logs (admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs (action);


-- =============================================================
-- 13. 초기 데이터 시드
-- =============================================================

-- ▶ 기본 관리자 (비밀번호는 반드시 배포 전 변경)
INSERT INTO admins (email, password_hash, name)
VALUES ('admin@vocalai.kr', '$2b$12$CHANGE_THIS_HASH_BEFORE_DEPLOY', '시스템관리자')
ON CONFLICT (email) DO NOTHING;

INSERT INTO global_emails (email, account_type)
VALUES ('admin@vocalai.kr', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ▶ 샘플 곡 데이터 (나무위키 고음/노래 목록 검증 완료)
INSERT INTO songs (title, artist, genre, lowest_note, highest_note, difficulty) VALUES
  ('밤편지',          '아이유',    '발라드', 'G3', '2옥라(A4)', 'easy'),
  ('Celebrity',      '아이유',    '팝',    'C4', '3옥도(C5)', 'medium'),
  ('야생화',          '박효신',    '발라드', 'C3', '3옥도(C5)', 'hard'),
  ('어디에도',        '이수',     '록/발라드', 'D#3', '3옥레(D5)', 'hard'),
  ('눈의 꽃',         '박효신',   '발라드', 'D3', '2옥솔#(G#4)', 'medium'),
  ('좋은 날',          '아이유',   '댄스/팝', 'C4', '3옥파#(F#5)', 'hard'),
  ('소주 한 잔',       '임창정',   '발라드', 'E3', '3옥레(D5)', 'hard'),
  ('봄날',            'BTS',     '팝',    'C4', '2옥라(A4)', 'medium')
ON CONFLICT DO NOTHING;

-- =============================================================
-- 14. 프론트엔드 API 동기화를 위한 Row Level Security 비활성화
-- =============================================================
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainers DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_emails DISABLE ROW LEVEL SECURITY;
ALTER TABLE songs DISABLE ROW LEVEL SECURITY;
ALTER TABLE vocal_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE vocal_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_reviews DISABLE ROW LEVEL SECURITY;

