--liquibase formatted sql

--changeset portfolio:016-alter-users-v1-1 runOnChange:false
--comment: Already handled in migration 002, kept here as documentation marker
SELECT 1;

--changeset portfolio:016-alter-profiles-seo runOnChange:false
--comment: Already handled in migration 003, kept here as documentation marker
SELECT 1;

--changeset portfolio:016-alter-projects-metadata runOnChange:false
--comment: Already handled in migration 006, kept here as documentation marker
SELECT 1;
