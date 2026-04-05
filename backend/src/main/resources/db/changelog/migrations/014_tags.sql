--liquibase formatted sql

--changeset portfolio:014-tags-table runOnChange:false
--comment: Create tags and blog_post_tags tables (v1.1)
CREATE TABLE IF NOT EXISTS tags (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL UNIQUE,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    color      VARCHAR(7),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

--changeset portfolio:014-blog-post-tags-table runOnChange:false
--comment: Create blog_post_tags join table (v1.1)
CREATE TABLE IF NOT EXISTS blog_post_tags (
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id)  ON DELETE CASCADE,
    tag_id       UUID NOT NULL REFERENCES tags(id)        ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);
