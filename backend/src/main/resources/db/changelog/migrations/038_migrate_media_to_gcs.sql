--liquibase formatted sql

--changeset portfolio:038-migrate-media-to-gcs runOnChange:false
--comment: Migrate all mgm_life_items media URLs from Google Drive to GCS

-- Instant Noodles at the Office (VIDEO)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/instant-noodles.mp4', media_type = 'VIDEO'
WHERE media_url LIKE '%1cHKeV4QUc72gL2yT67jjIcaWlS7dt3Sa%';

-- Onboarding Gift — Welcome to mgm! (IMAGE)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/onboarding-gift.jpg', media_type = 'IMAGE'
WHERE media_url LIKE '%13fNZIyL-S3BHRiAGc0HKUEKWEacQb_C0%';

-- English Class — Outdoor Session (VIDEO)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/english-outdoor.mp4', media_type = 'VIDEO'
WHERE media_url LIKE '%1qq58Z7xGwiaP31H5ar3lXOZaszFZKBYH%';

-- English Class (VIDEO)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/english-class.mp4', media_type = 'VIDEO'
WHERE media_url LIKE '%1ACxtxOFS9C8RvT4DYFldw4TyuBTeRPI8%';

-- Software Quality Standards (IMAGE)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/software-quality.jpg', media_type = 'IMAGE'
WHERE media_url LIKE '%110ZpnhR08VEg0yGXEpK3TFLkU0DJcWd9%';

-- Piano at the Office (VIDEO)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/piano-office.mp4', media_type = 'VIDEO'
WHERE media_url LIKE '%1GHIaIRqA13a8s9PE5BubeEKzjYoqPwAo%';

-- Tech Talk at mgm (IMAGE)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/tech-talk.jpg', media_type = 'IMAGE'
WHERE media_url LIKE '%1d61zh7zySVYgT3IVv2feCuzX38dkMOVN%';

-- mgm Office (VIDEO)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/mgm-office.mp4', media_type = 'VIDEO'
WHERE media_url LIKE '%1xE8O5NKYhkUWVVdLy58JcoJy4I8q9MYU%';

-- mgm Office Da Nang (IMAGE - HEIF)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/mgm-office-danang.jpg', media_type = 'IMAGE'
WHERE media_url LIKE '%1lrNiWQLUgSBCX9GhLVoQXPXzs9Midz1d%';

-- mgm Office Rooftop (IMAGE)
UPDATE mgm_life_items SET media_url = 'https://storage.googleapis.com/mgm-portfolio-media/mgm-life/mgm-office-rooftop.jpg', media_type = 'IMAGE'
WHERE media_url LIKE '%1PzieFriIyLxMr8Q3lxmnoOlW7hy02C80%';
