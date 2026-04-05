--liquibase formatted sql

--changeset portfolio:010-contacts-table runOnChange:false
--comment: Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    subject    VARCHAR(300),
    message    TEXT         NOT NULL,
    read       BOOLEAN      DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
