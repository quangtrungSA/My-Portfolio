--liquibase formatted sql

--changeset portfolio:006-projects-table runOnChange:false
--comment: Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    image_url   VARCHAR(500),
    tech_stack  TEXT[]       DEFAULT '{}',
    github_url  VARCHAR(500),
    live_url    VARCHAR(500),
    featured    BOOLEAN      DEFAULT FALSE,
    sort_order  INTEGER      DEFAULT 0,
    category    VARCHAR(50),
    status      VARCHAR(20)  DEFAULT 'completed',
    start_date  DATE,
    end_date    DATE,
    client_name VARCHAR(200),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

--changeset portfolio:006-projects-v1-1-cols runOnChange:false
--comment: Add richer metadata columns to existing projects table (v1.1, idempotent)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category    VARCHAR(50);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status      VARCHAR(20) DEFAULT 'completed';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date  DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date    DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name VARCHAR(200);
