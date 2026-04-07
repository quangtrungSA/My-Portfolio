--liquibase formatted sql

--changeset portfolio:032-seed-mgm-office runOnChange:false
--comment: Add mgm Da Nang office photo

INSERT INTO mgm_life_items (title, description, media_type, media_url, thumbnail_url, category, sort_order, published)
VALUES (
  'mgm Office — Da Nang',
  'Our workspace in the heart of Da Nang — open, modern, and welcoming.',
  'IMAGE',
  'https://drive.google.com/uc?export=view&id=1xE8O5NKYhkUWVVdLy58JcoJy4I8q9MYU',
  NULL,
  'COMPANY_OVERVIEW',
  4,
  TRUE
);
