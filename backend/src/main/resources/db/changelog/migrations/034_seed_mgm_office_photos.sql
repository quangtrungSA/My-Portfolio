--liquibase formatted sql

--changeset portfolio:034-seed-mgm-office-photos runOnChange:false
--comment: Add mgm Da Nang office photos for the About section

INSERT INTO mgm_life_items (title, description, media_type, media_url, thumbnail_url, category, sort_order, published)
VALUES
  (
    'mgm Office Da Nang — Workspace',
    'A modern, collaborative workspace where the team builds enterprise software for global clients.',
    'IMAGE',
    'https://drive.google.com/uc?export=view&id=1dKCMJjTeqgcVdIjsmRv6hGBMJ9dpj68Q',
    NULL,
    'COMPANY_OVERVIEW',
    5,
    TRUE
  ),
  (
    'mgm Office Da Nang — Team Area',
    'Open team area designed for collaboration — where Vietnamese and international engineers work side by side.',
    'IMAGE',
    'https://drive.google.com/uc?export=view&id=14vhCNIqbuOTZl-ljJuIoypIDf_1mjhpa',
    NULL,
    'COMPANY_OVERVIEW',
    6,
    TRUE
  );
