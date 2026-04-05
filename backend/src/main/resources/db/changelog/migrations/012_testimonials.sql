--liquibase formatted sql

--changeset portfolio:012-testimonials-table runOnChange:false
--comment: Create testimonials table (v1.1)
CREATE TABLE IF NOT EXISTS testimonials (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name   VARCHAR(100) NOT NULL,
    author_title  VARCHAR(200),
    author_avatar VARCHAR(500),
    content       TEXT         NOT NULL,
    rating        INTEGER      CHECK (rating BETWEEN 1 AND 5),
    featured      BOOLEAN      DEFAULT FALSE,
    sort_order    INTEGER      DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
