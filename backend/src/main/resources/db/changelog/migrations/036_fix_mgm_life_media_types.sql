--liquibase formatted sql

--changeset portfolio:036-fix-mgm-life-media-types runOnChange:false
--comment: Fix items incorrectly set to VIDEO — these are images, not videos

UPDATE mgm_life_items SET media_type = 'IMAGE'
WHERE media_url LIKE '%13HcKoP-xkU6zLAkVG93vzUCtdg-WT9Xk%';

UPDATE mgm_life_items SET media_type = 'IMAGE'
WHERE media_url LIKE '%1EvGNzQ5tmhG6sf0-WCY6aI3VH7ElYJih%';

UPDATE mgm_life_items SET media_type = 'IMAGE'
WHERE media_url LIKE '%1ZEsaj7zr0UHGTyOHBv9vKMfSWXIWJ0mi%';

UPDATE mgm_life_items SET media_type = 'IMAGE'
WHERE media_url LIKE '%19QqwZGUpQgAvUwl_ZdiX6VZ3WAlRosFX%';
