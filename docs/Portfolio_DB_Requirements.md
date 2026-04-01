# Portfolio Application - Database Requirements Analysis

**New Tables & Schema Updates**
**Version 1.0 | April 2026**
**Tech Stack:** Next.js 14 | Spring Boot 3.4 | PostgreSQL (Neon) | shadcn/ui

---

## 1. Executive Summary

This document analyzes the current database schema of the Portfolio application and provides recommendations for new tables and schema updates to support additional features, improve data integrity, and enhance the overall user experience.

The current schema consists of **8 tables** supporting core portfolio functionality. After thorough analysis, we recommend creating **5 new tables** and updating **3 existing tables**.

| Current Tables | New Tables Proposed | Tables to Update |
|:-:|:-:|:-:|
| **8 tables** | **5 new tables** | **3 updates** |

---

## 2. Current Database Schema

| Table | Purpose | Status | Priority |
|-------|---------|--------|----------|
| **users** | Admin authentication | Update | High |
| **profiles** | Personal information & social links | Update | Medium |
| **skills** | Technical skills by category | Keep | Low |
| **projects** | Portfolio projects showcase | Update | High |
| **experiences** | Work experience timeline | Keep | Low |
| **education** | Education history | Keep | Low |
| **blog_posts** | Blog content management | Keep | Low |
| **contacts** | Contact form submissions | Keep | Low |

---

## 3. New Tables Required

### 3.1 `certifications`

**Justification:** Professional certifications (AWS, Google Cloud, Oracle, etc.) are a critical component of developer portfolios. Currently there is no way to showcase certifications, which is a common expectation for professional portfolio sites.

- Displays professional certifications and licenses
- Supports credential verification URLs
- Tracks issue and expiry dates for credential management

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| **id** | UUID | NO | Primary key, auto-generated |
| **name** | VARCHAR(200) | NO | Certification name (e.g. AWS Solutions Architect) |
| **issuing_org** | VARCHAR(200) | NO | Issuing organization (e.g. Amazon Web Services) |
| **credential_id** | VARCHAR(200) | YES | Credential ID for verification |
| **credential_url** | VARCHAR(500) | YES | URL to verify the credential |
| **badge_url** | VARCHAR(500) | YES | Badge/logo image URL |
| **issue_date** | DATE | NO | Date the certification was issued |
| **expiry_date** | DATE | YES | Expiration date (NULL = no expiry) |
| **sort_order** | INTEGER | YES | Display order, default 0 |
| **created_at** | TIMESTAMPTZ | NO | Record creation timestamp |
| **updated_at** | TIMESTAMPTZ | NO | Last update timestamp |

```sql
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
```

---

### 3.2 `testimonials`

**Justification:** Social proof is essential for a professional portfolio. Testimonials from colleagues, clients, or managers significantly increase credibility. There is currently no mechanism to display recommendations.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| **id** | UUID | NO | Primary key |
| **author_name** | VARCHAR(100) | NO | Name of the person giving testimonial |
| **author_title** | VARCHAR(200) | YES | Job title (e.g. CTO at TechCorp) |
| **author_avatar** | VARCHAR(500) | YES | Avatar image URL |
| **content** | TEXT | NO | Testimonial text |
| **rating** | INTEGER | YES | Rating 1-5 (optional star display) |
| **featured** | BOOLEAN | YES | Show on homepage, default false |
| **sort_order** | INTEGER | YES | Display order |
| **created_at** | TIMESTAMPTZ | NO | Record creation timestamp |
| **updated_at** | TIMESTAMPTZ | NO | Last update timestamp |

```sql
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
```

---

### 3.3 `project_images`

**Justification:** The current projects table only supports a single `image_url`. Most portfolio projects benefit from multiple screenshots showing different views, features, or responsive layouts. A separate table enables a gallery per project.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| **id** | UUID | NO | Primary key |
| **project_id** | UUID | NO | FK to projects.id (ON DELETE CASCADE) |
| **image_url** | VARCHAR(500) | NO | Image URL |
| **caption** | VARCHAR(300) | YES | Image caption/description |
| **is_primary** | BOOLEAN | YES | Primary image for card display, default false |
| **sort_order** | INTEGER | YES | Display order in gallery |
| **created_at** | TIMESTAMPTZ | NO | Record creation timestamp |

```sql
CREATE TABLE IF NOT EXISTS project_images (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url   VARCHAR(500)  NOT NULL,
    caption     VARCHAR(300),
    is_primary  BOOLEAN       DEFAULT FALSE,
    sort_order  INTEGER       DEFAULT 0,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);
```

---

### 3.4 `tags` + `blog_post_tags` (Normalized Tags)

**Justification:** Currently, `blog_posts.tags` uses a PostgreSQL `TEXT[]` array. While functional, this approach makes it difficult to query posts by tag, enforce tag consistency, display tag clouds, or reuse tags across entities. A normalized tag system with a junction table is the standard relational approach.

#### `tags` table

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| **id** | UUID | NO | Primary key |
| **name** | VARCHAR(100) | NO | Tag name (UNIQUE) |
| **slug** | VARCHAR(100) | NO | URL-friendly slug (UNIQUE) |
| **color** | VARCHAR(7) | YES | Hex color for UI display |
| **created_at** | TIMESTAMPTZ | NO | Record creation timestamp |

#### `blog_post_tags` (junction table)

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| **blog_post_id** | UUID | NO | FK to blog_posts.id (ON DELETE CASCADE) |
| **tag_id** | UUID | NO | FK to tags.id (ON DELETE CASCADE) |

*PRIMARY KEY: (blog_post_id, tag_id) composite key*

```sql
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

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag ON blog_post_tags(tag_id);
```

---

### 3.5 `site_settings`

**Justification:** The application currently hardcodes site-level configuration (SEO metadata, theme preferences, analytics IDs, maintenance mode). A key-value settings table allows dynamic configuration without code changes or redeployment.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| **id** | UUID | NO | Primary key |
| **key** | VARCHAR(100) | NO | Setting key (UNIQUE), e.g. site_title, ga_id |
| **value** | TEXT | YES | Setting value (stored as text, parsed by app) |
| **type** | VARCHAR(20) | NO | Value type: string, boolean, number, json |
| **description** | VARCHAR(500) | YES | Human-readable description for admin UI |
| **updated_at** | TIMESTAMPTZ | NO | Last update timestamp |

```sql
CREATE TABLE IF NOT EXISTS site_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(100)  NOT NULL UNIQUE,
    value       TEXT,
    type        VARCHAR(20)   NOT NULL DEFAULT 'string',
    description VARCHAR(500),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

---

## 4. Existing Table Updates

### 4.1 `users` table

Add security fields for password reset and account management.

| New Column | Action | Type | Reason |
|------------|--------|------|--------|
| **last_login_at** | Required | TIMESTAMPTZ | Track last login time for security auditing |
| **password_changed_at** | Recommended | TIMESTAMPTZ | Track when password was last changed |
| **avatar_url** | Optional | VARCHAR(500) | Admin user profile picture for CMS display |

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
```

---

### 4.2 `profiles` table

Add SEO and branding fields to improve search engine visibility and customization.

| New Column | Action | Type | Reason |
|------------|--------|------|--------|
| **meta_title** | Recommended | VARCHAR(200) | Custom SEO title for homepage |
| **meta_description** | Recommended | VARCHAR(500) | Custom SEO description for homepage |
| **og_image_url** | Recommended | VARCHAR(500) | Open Graph image for social sharing |
| **tagline** | Optional | VARCHAR(300) | Short tagline separate from the bio |
| **available_for_hire** | Optional | BOOLEAN | Show availability status badge |

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_title VARCHAR(200);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_description VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS og_image_url VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tagline VARCHAR(300);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_for_hire BOOLEAN DEFAULT FALSE;
```

---

### 4.3 `projects` table

Add fields for richer project metadata and categorization.

| New Column | Action | Type | Reason |
|------------|--------|------|--------|
| **category** | Recommended | VARCHAR(50) | Project category (Web, Mobile, API, etc.) for filtering |
| **status** | Recommended | VARCHAR(20) | Project status: completed, in_progress, archived |
| **start_date** | Optional | DATE | When the project was started |
| **end_date** | Optional | DATE | When the project was completed (NULL = ongoing) |
| **client_name** | Optional | VARCHAR(200) | Client/company name for freelance projects |

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'completed';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name VARCHAR(200);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
```

---

## 5. Impact Analysis

### 5.1 Backend Changes Required

- New Entity classes: `Certification`, `Testimonial`, `ProjectImage`, `Tag`, `BlogPostTag`, `SiteSetting`
- New Repository interfaces for each new entity
- New Service classes with CRUD operations
- New REST Controllers with public GET and admin CRUD endpoints
- Updated DTOs for modified tables (users, profiles, projects)
- Migration script for schema.sql additions

### 5.2 Frontend Changes Required

- New public sections: Certifications, Testimonials, Project Gallery
- New admin pages: Certifications CRUD, Testimonials CRUD, Site Settings
- Updated admin pages: Projects (add gallery management, new fields)
- Updated admin pages: Profile (add SEO fields)
- Updated TypeScript types for all new/modified entities
- Updated API client with new endpoint functions

### 5.3 Migration Strategy

1. All changes use `IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` to be non-destructive
2. New tables have no foreign key dependencies on existing data (except `project_images`)
3. Column additions to existing tables use nullable fields with defaults
4. Tag migration: existing `TEXT[]` tags can be migrated to normalized tables via a one-time script
5. Zero downtime: all changes are backward-compatible

---

## 6. Implementation Priority

Recommended implementation order based on user impact and complexity:

| # | Change | Priority | Effort | Dependencies |
|:-:|--------|----------|--------|--------------|
| 1 | **certifications** table | High | Low (2-3 hrs) | None - standalone new feature |
| 2 | **testimonials** table | High | Low (2-3 hrs) | None - standalone new feature |
| 3 | **projects** table updates | High | Low (1-2 hrs) | Update existing entity + admin UI |
| 4 | **project_images** table | Medium | Med (3-4 hrs) | Depends on projects table existing |
| 5 | **profiles** table updates | Medium | Low (1-2 hrs) | Update existing entity + admin UI |
| 6 | **users** table updates | Medium | Low (1 hr) | Update existing entity + auth service |
| 7 | **site_settings** table | Low | Med (2-3 hrs) | New admin settings page needed |
| 8 | **tags** normalization | Low | High (4-5 hrs) | Requires data migration from TEXT[] to junction table |

**Total Estimated Effort: 16-23 hours**

*All changes are non-breaking and can be implemented incrementally alongside existing functionality.*
