--liquibase formatted sql

--changeset portfolio:005-skills-table runOnChange:false
--comment: Create skills table with category_id FK
CREATE TABLE IF NOT EXISTS skills (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    category_id UUID         NOT NULL REFERENCES skill_categories(id),
    icon        VARCHAR(100),
    sort_order  INTEGER      DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

--changeset portfolio:005-skills-migrate-categories runOnChange:false
--comment: Migrate extra categories from existing skills.category string (idempotent)
INSERT INTO skill_categories (name, sort_order)
SELECT DISTINCT category, 99 FROM skills WHERE category IS NOT NULL
ON CONFLICT (name) DO NOTHING;

--changeset portfolio:005-skills-add-category-id runOnChange:false
--comment: Add category_id FK column if not yet present
ALTER TABLE skills ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES skill_categories(id);

--changeset portfolio:005-skills-backfill-category-id runOnChange:false
--comment: Back-fill category_id from legacy category string column
UPDATE skills s
SET category_id = sc.id
FROM skill_categories sc
WHERE s.category = sc.name
  AND s.category_id IS NULL;

--changeset portfolio:005-skills-drop-category-col runOnChange:false
--comment: Drop legacy category string column
ALTER TABLE skills DROP COLUMN IF EXISTS category;
