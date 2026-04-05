--liquibase formatted sql

--changeset portfolio:008-education-table runOnChange:false
--comment: Create education table
CREATE TABLE IF NOT EXISTS education (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution VARCHAR(200) NOT NULL,
    degree      VARCHAR(200) NOT NULL,
    field       VARCHAR(200),
    start_date  DATE         NOT NULL,
    end_date    DATE,
    description TEXT,
    logo_url    VARCHAR(500),
    sort_order  INTEGER      DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
