--liquibase formatted sql

--changeset portfolio:002-users-table runOnChange:false
--comment: Create users table
CREATE TABLE IF NOT EXISTS users (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username             VARCHAR(50)  NOT NULL UNIQUE,
    email                VARCHAR(255) NOT NULL UNIQUE,
    password_hash        VARCHAR(255) NOT NULL,
    role                 VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    last_login_at        TIMESTAMPTZ,
    password_changed_at  TIMESTAMPTZ,
    avatar_url           VARCHAR(500),
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

--changeset portfolio:002-users-security-cols runOnChange:false
--comment: Add security columns to existing users table (idempotent)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at       TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url          VARCHAR(500);
