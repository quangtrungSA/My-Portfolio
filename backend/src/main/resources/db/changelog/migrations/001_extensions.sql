--liquibase formatted sql

--changeset portfolio:001-extensions runOnChange:false
--comment: Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
