--liquibase formatted sql

--changeset portfolio:018-experience-phases-table runOnChange:false
--comment: Create experience_phases table (v1.2)
CREATE TABLE IF NOT EXISTS experience_phases (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id UUID         NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    name          VARCHAR(200) NOT NULL,
    start_date    DATE,
    end_date      DATE,
    team_size     INTEGER,
    sort_order    INTEGER      DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

--changeset portfolio:018-experience-phases-add-team-size runOnChange:false
--comment: Add team_size column to existing experience_phases table (idempotent)
ALTER TABLE experience_phases ADD COLUMN IF NOT EXISTS team_size INTEGER;

--changeset portfolio:018-experience-roles-table runOnChange:false
--comment: Create experience_roles table (v1.2)
CREATE TABLE IF NOT EXISTS experience_roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id    UUID    NOT NULL REFERENCES experience_phases(id) ON DELETE CASCADE,
    name        TEXT    NOT NULL,
    description TEXT,
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--changeset portfolio:018-experience-roles-alter-name runOnChange:false
--comment: Ensure name column is TEXT type
ALTER TABLE experience_roles ALTER COLUMN name TYPE TEXT;

--changeset portfolio:018-experience-phases-roles-indexes runOnChange:false
--comment: Add indexes for experience phases and roles
CREATE INDEX IF NOT EXISTS idx_experience_phases_exp   ON experience_phases(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_roles_phase  ON experience_roles(phase_id);
