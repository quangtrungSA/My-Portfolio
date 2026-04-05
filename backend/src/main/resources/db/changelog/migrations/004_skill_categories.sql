--liquibase formatted sql

--changeset portfolio:004-skill-categories-table runOnChange:false
--comment: Create skill_categories table
CREATE TABLE IF NOT EXISTS skill_categories (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(50)  NOT NULL UNIQUE,
    color      VARCHAR(50),
    sort_order INTEGER      DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

--changeset portfolio:004-skill-categories-seed runOnChange:false
--comment: Seed default skill categories
INSERT INTO skill_categories (name, color, sort_order) VALUES
    ('Backend',        'blue',    0),
    ('Frontend',       'purple',  1),
    ('Database',       'amber',   2),
    ('Infrastructure', 'emerald', 3),
    ('Tools',          'rose',    4),
    ('Other',          'gray',    5)
ON CONFLICT (name) DO NOTHING;
