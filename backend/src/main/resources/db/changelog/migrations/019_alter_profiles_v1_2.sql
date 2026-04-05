--liquibase formatted sql

--changeset portfolio:019-profiles-career-summary runOnChange:false
--comment: Add career_summary and international_clients columns (v1.2)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS career_summary        TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS international_clients JSONB DEFAULT '[]'::jsonb;
