CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      VARCHAR(50)   NOT NULL UNIQUE,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          VARCHAR(20)   NOT NULL DEFAULT 'ADMIN',
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100)  NOT NULL,
    title         VARCHAR(200)  NOT NULL,
    bio           TEXT,
    avatar_url    VARCHAR(500),
    resume_url    VARCHAR(500),
    social_links  JSONB         DEFAULT '{}',
    location      VARCHAR(200),
    email         VARCHAR(255),
    phone         VARCHAR(50),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              VARCHAR(100)  NOT NULL,
    category          VARCHAR(50)   NOT NULL,
    proficiency_level INTEGER       NOT NULL CHECK (proficiency_level BETWEEN 1 AND 100),
    icon              VARCHAR(100),
    sort_order        INTEGER       DEFAULT 0,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(200)  NOT NULL,
    description TEXT,
    image_url   VARCHAR(500),
    tech_stack  TEXT[]        DEFAULT '{}',
    github_url  VARCHAR(500),
    live_url    VARCHAR(500),
    featured    BOOLEAN       DEFAULT FALSE,
    sort_order  INTEGER       DEFAULT 0,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiences (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company     VARCHAR(200)  NOT NULL,
    position    VARCHAR(200)  NOT NULL,
    start_date  DATE          NOT NULL,
    end_date    DATE,
    description TEXT,
    logo_url    VARCHAR(500),
    sort_order  INTEGER       DEFAULT 0,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution VARCHAR(200)  NOT NULL,
    degree      VARCHAR(200)  NOT NULL,
    field       VARCHAR(200),
    start_date  DATE          NOT NULL,
    end_date    DATE,
    description TEXT,
    logo_url    VARCHAR(500),
    sort_order  INTEGER       DEFAULT 0,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(300)  NOT NULL,
    slug        VARCHAR(300)  NOT NULL UNIQUE,
    content     TEXT          NOT NULL,
    excerpt     VARCHAR(500),
    cover_image VARCHAR(500),
    published   BOOLEAN       DEFAULT FALSE,
    tags        TEXT[]        DEFAULT '{}',
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(255)  NOT NULL,
    subject     VARCHAR(300),
    message     TEXT          NOT NULL,
    read        BOOLEAN       DEFAULT FALSE,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =====================================================
-- NEW TABLES (v1.1)
-- =====================================================

CREATE TABLE IF NOT EXISTS certifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200)  NOT NULL,
    issuing_org     VARCHAR(200)  NOT NULL,
    credential_id   VARCHAR(200),
    credential_url  VARCHAR(500),
    badge_url       VARCHAR(500),
    issue_date      DATE          NOT NULL,
    expiry_date     DATE,
    sort_order      INTEGER       DEFAULT 0,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name     VARCHAR(100)  NOT NULL,
    author_title    VARCHAR(200),
    author_avatar   VARCHAR(500),
    content         TEXT          NOT NULL,
    rating          INTEGER       CHECK (rating BETWEEN 1 AND 5),
    featured        BOOLEAN       DEFAULT FALSE,
    sort_order      INTEGER       DEFAULT 0,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_images (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url   VARCHAR(500)  NOT NULL,
    caption     VARCHAR(300),
    is_primary  BOOLEAN       DEFAULT FALSE,
    sort_order  INTEGER       DEFAULT 0,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100)  NOT NULL UNIQUE,
    slug        VARCHAR(100)  NOT NULL UNIQUE,
    color       VARCHAR(7),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_post_tags (
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id       UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS site_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(100)  NOT NULL UNIQUE,
    value       TEXT,
    type        VARCHAR(20)   NOT NULL DEFAULT 'string',
    description VARCHAR(500),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ALTER EXISTING TABLES (v1.1)
-- =====================================================

-- users: security fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- profiles: SEO + branding
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_title VARCHAR(200);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_description VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS og_image_url VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tagline VARCHAR(300);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_for_hire BOOLEAN DEFAULT FALSE;

-- projects: richer metadata
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'completed';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name VARCHAR(200);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(read);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certifications_sort ON certifications(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag ON blog_post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
