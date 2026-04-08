--liquibase formatted sql

--changeset portfolio:037-auto-set-video-media-type runOnChange:false
--comment: Auto-detect video URLs and set media_type = VIDEO. Google Drive video URLs contain /file/d/ with /view or /preview suffix.

UPDATE mgm_life_items
SET media_type = 'VIDEO'
WHERE (media_url LIKE '%/file/d/%/view%' OR media_url LIKE '%/file/d/%/preview%')
  AND media_type != 'VIDEO';
