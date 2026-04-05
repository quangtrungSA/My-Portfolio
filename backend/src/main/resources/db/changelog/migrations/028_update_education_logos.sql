--liquibase formatted sql

--changeset portfolio:028-update-education-logos runOnChange:false
--comment: Set logo URLs for education institutions
UPDATE education
SET logo_url   = '/images/logos/danang-university.svg',
    updated_at = NOW()
WHERE institution ILIKE '%Da Nang University%';

UPDATE education
SET logo_url   = '/images/company/fpt.png',
    updated_at = NOW()
WHERE institution ILIKE '%FPT%';
