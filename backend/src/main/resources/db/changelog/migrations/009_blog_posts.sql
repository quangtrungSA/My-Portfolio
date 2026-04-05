--liquibase formatted sql

--changeset portfolio:009-blog-posts-table runOnChange:false
--comment: Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(300) NOT NULL,
    slug        VARCHAR(300) NOT NULL UNIQUE,
    content     TEXT         NOT NULL,
    excerpt     VARCHAR(500),
    cover_image VARCHAR(500),
    published   BOOLEAN      DEFAULT FALSE,
    tags        TEXT[]       DEFAULT '{}',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
