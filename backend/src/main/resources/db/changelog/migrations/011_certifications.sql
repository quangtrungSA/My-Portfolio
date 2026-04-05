--liquibase formatted sql

--changeset portfolio:011-certifications-table runOnChange:false
--comment: Create certifications table (v1.1)
CREATE TABLE IF NOT EXISTS certifications (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           VARCHAR(200) NOT NULL,
    issuing_org    VARCHAR(200) NOT NULL,
    credential_id  VARCHAR(200),
    credential_url VARCHAR(500),
    badge_url      VARCHAR(500),
    issue_date     DATE         NOT NULL,
    expiry_date    DATE,
    sort_order     INTEGER      DEFAULT 0,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
