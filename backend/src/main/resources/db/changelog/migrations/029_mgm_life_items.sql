--liquibase formatted sql

--changeset portfolio:029-mgm-life-items-table runOnChange:false
--comment: Create mgm_life_items table for MGM Life page media gallery
CREATE TABLE IF NOT EXISTS mgm_life_items (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    media_type    VARCHAR(20)  NOT NULL DEFAULT 'IMAGE' CHECK (media_type IN ('IMAGE', 'VIDEO')),
    media_url     VARCHAR(1000),
    thumbnail_url VARCHAR(1000),
    category      VARCHAR(50)  NOT NULL DEFAULT 'GENERAL' CHECK (category IN ('ENGLISH_CLASS', 'HAPPY_FRIDAY', 'COMPANY_OVERVIEW', 'GENERAL')),
    sort_order    INTEGER      DEFAULT 0,
    published     BOOLEAN      DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
