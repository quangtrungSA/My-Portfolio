--liquibase formatted sql

--changeset portfolio:022-experience-logo-url-to-text runOnChange:false
--comment: Change logo_url from VARCHAR(500) to TEXT to support base64 image data
ALTER TABLE experiences ALTER COLUMN logo_url TYPE TEXT;
