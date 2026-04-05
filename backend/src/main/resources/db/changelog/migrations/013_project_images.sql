--liquibase formatted sql

--changeset portfolio:013-project-images-table runOnChange:false
--comment: Create project_images table (v1.1)
CREATE TABLE IF NOT EXISTS project_images (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID         NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url  VARCHAR(500) NOT NULL,
    caption    VARCHAR(300),
    is_primary BOOLEAN      DEFAULT FALSE,
    sort_order INTEGER      DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
