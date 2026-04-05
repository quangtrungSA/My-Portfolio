--liquibase formatted sql

--changeset portfolio:003-profiles-table runOnChange:false
--comment: Create profiles table with all columns
CREATE TABLE IF NOT EXISTS profiles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(100) NOT NULL,
    title               VARCHAR(200) NOT NULL,
    bio                 TEXT,
    avatar_url          VARCHAR(500),
    resume_url          VARCHAR(500),
    github_url          VARCHAR(500),
    linkedin_url        VARCHAR(500),
    facebook_url        VARCHAR(500),
    instagram_url       VARCHAR(500),
    leetcode_url        VARCHAR(500),
    dailydev_url        VARCHAR(500),
    reddit_url          VARCHAR(500),
    twitter_url         VARCHAR(500),
    website_url         VARCHAR(500),
    location            VARCHAR(200),
    email               VARCHAR(255),
    phone               VARCHAR(50),
    meta_title          VARCHAR(200),
    meta_description    VARCHAR(500),
    og_image_url        VARCHAR(500),
    tagline             VARCHAR(300),
    available_for_hire  BOOLEAN DEFAULT FALSE,
    career_summary      TEXT,
    international_clients JSONB DEFAULT '[]'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--changeset portfolio:003-profiles-social-cols runOnChange:false
--comment: Add social link columns to existing profiles table (idempotent)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url    VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url  VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS facebook_url  VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS leetcode_url  VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dailydev_url  VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reddit_url    VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url   VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url   VARCHAR(500);

--changeset portfolio:003-profiles-drop-social-links runOnChange:false
--comment: Drop deprecated social_links JSONB column
ALTER TABLE profiles DROP COLUMN IF EXISTS social_links;

--changeset portfolio:003-profiles-seo-cols runOnChange:false
--comment: Add SEO and branding columns (v1.1)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_title         VARCHAR(200);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_description   VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS og_image_url       VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tagline            VARCHAR(300);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_for_hire BOOLEAN DEFAULT FALSE;
