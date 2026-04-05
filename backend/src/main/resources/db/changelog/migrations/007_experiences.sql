--liquibase formatted sql

--changeset portfolio:007-experiences-table runOnChange:false
--comment: Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company      VARCHAR(200) NOT NULL,
    position     VARCHAR(200) NOT NULL,
    project_name VARCHAR(300),
    start_date   DATE         NOT NULL,
    end_date     DATE,
    goal         TEXT,
    technologies TEXT[]       DEFAULT '{}',
    logo_url     VARCHAR(500),
    sort_order   INTEGER      DEFAULT 0,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

--changeset portfolio:007-experiences-add-goal runOnChange:false
--comment: Add goal column to existing experiences table (idempotent)
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS goal TEXT;

--changeset portfolio:007-experiences-add-project-name runOnChange:false
--comment: Add project_name column to existing experiences table (idempotent)
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS project_name VARCHAR(300);

--changeset portfolio:007-experiences-drop-description runOnChange:false
--comment: Drop description column (data migrated to phases/roles)
ALTER TABLE experiences DROP COLUMN IF EXISTS description;

--changeset portfolio:007-experiences-add-technologies runOnChange:false
--comment: Add technologies array column (idempotent)
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
