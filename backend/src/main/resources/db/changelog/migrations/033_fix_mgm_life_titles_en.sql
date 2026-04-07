--liquibase formatted sql

--changeset portfolio:033-fix-mgm-life-titles-en runOnChange:false
--comment: Update mgm_life_items titles and descriptions to English

UPDATE mgm_life_items SET
  title       = 'English Class — Outdoor Session',
  description = 'Teachers and students explore Da Nang together during class hours.'
WHERE media_url LIKE '%1EvGNzQ5tmhG6sf0-WCY6aI3VH7ElYJih%';

UPDATE mgm_life_items SET
  title       = 'English Class',
  description = '2-hour daily English class at the office — counted as paid working hours.'
WHERE media_url LIKE '%19QqwZGUpQgAvUwl_ZdiX6VZ3WAlRosFX%';

UPDATE mgm_life_items SET
  title       = 'Instant Noodles at the Office',
  description = 'Late afternoons cooking instant noodles together — the most wholesome moment at mgm.'
WHERE media_url LIKE '%13HcKoP-xkU6zLAkVG93vzUCtdg-WT9Xk%';

UPDATE mgm_life_items SET
  title       = 'Piano at the Office',
  description = 'The office piano — a place to unwind and share a passion for music.'
WHERE media_url LIKE '%1ZEsaj7zr0UHGTyOHBv9vKMfSWXIWJ0mi%';

UPDATE mgm_life_items SET
  title       = 'Onboarding Gift — Welcome to mgm!',
  description = 'A warm welcome card from Ms. Ngo Loan — Deputy General Director of mgm technology partners Vietnam.'
WHERE media_url LIKE '%1wigY74letDLUD-uUSeBtmMxY4Lgq_AnN%';

UPDATE mgm_life_items SET
  title       = 'Software Quality Standards — ISO/IEC 25010',
  description = 'International speaker session on software quality characteristics: usability, reliability, security and more.'
WHERE media_url LIKE '%110ZpnhR08VEg0yGXEpK3TFLkU0DJcWd9%';

UPDATE mgm_life_items SET
  title       = 'Tech Talk at mgm',
  description = 'Knowledge sharing session — engineers presenting and discussing technical topics.'
WHERE media_url LIKE '%1d61zh7zySVYgT3IVv2feCuzX38dkMOVN%';
