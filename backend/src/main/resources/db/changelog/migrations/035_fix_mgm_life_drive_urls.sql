--liquibase formatted sql

--changeset portfolio:035-fix-mgm-life-drive-urls runOnChange:false
--comment: Replace deprecated uc?export=view Google Drive URLs with thumbnail API URLs

UPDATE mgm_life_items
SET media_url = REGEXP_REPLACE(
    media_url,
    'https://drive\.google\.com/uc\?export=view&id=([a-zA-Z0-9_-]+)',
    'https://drive.google.com/thumbnail?id=\1&sz=w1280'
)
WHERE media_url LIKE 'https://drive.google.com/uc?export=view%';
