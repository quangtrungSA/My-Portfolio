--liquibase formatted sql

--changeset portfolio:031-seed-mgm-life-items-2 runOnChange:false
--comment: Seed additional MGM Life media items (company overview)

INSERT INTO mgm_life_items (title, description, media_type, media_url, thumbnail_url, category, sort_order, published)
VALUES
  (
    'Software Quality Standards - ISO/IEC 25010',
    'Presentation on software quality characteristics defined by ISO/IEC 25010:2011 — covering usability, reliability, security and more.',
    'IMAGE',
    'https://drive.google.com/uc?export=view&id=110ZpnhR08VEg0yGXEpK3TFLkU0DJcWd9',
    NULL,
    'COMPANY_OVERVIEW',
    2,
    TRUE
  ),
  (
    'Onboarding Gift — Welcome to mgm!',
    'A warm welcome card to Trung from Ms. Ngo Loan — Deputy General Director of mgm technology partners Vietnam.',
    'IMAGE',
    'https://drive.google.com/uc?export=view&id=1wigY74letDLUD-uUSeBtmMxY4Lgq_AnN',
    NULL,
    'COMPANY_OVERVIEW',
    1,
    TRUE
  ),
  (
    'Tech Talk at mgm',
    'Knowledge sharing session — engineers presenting and discussing technical topics within the team.',
    'IMAGE',
    'https://drive.google.com/uc?export=view&id=1d61zh7zySVYgT3IVv2feCuzX38dkMOVN',
    NULL,
    'COMPANY_OVERVIEW',
    3,
    TRUE
  );
