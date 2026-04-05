--liquibase formatted sql

--changeset portfolio:025-update-mgm-logo-url runOnChange:false
--comment: Update mgm logo_url to use real PNG from /images/company/
UPDATE experiences
SET logo_url   = '/images/company/mgm.png',
    updated_at = NOW()
WHERE company ILIKE '%mgm%';
