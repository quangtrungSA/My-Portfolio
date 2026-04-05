--liquibase formatted sql

--changeset portfolio:015-site-settings-table runOnChange:false
--comment: Create site_settings table (v1.1)
CREATE TABLE IF NOT EXISTS site_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(100) NOT NULL UNIQUE,
    value       TEXT,
    type        VARCHAR(20)  NOT NULL DEFAULT 'string',
    description VARCHAR(500),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
