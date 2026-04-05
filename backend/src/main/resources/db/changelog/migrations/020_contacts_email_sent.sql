--liquibase formatted sql

--changeset portfolio:020-contacts-email-sent runOnChange:false
--comment: Track whether notification email was sent for each contact submission
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email_sent     BOOLEAN     DEFAULT FALSE;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email_sent_at  TIMESTAMPTZ;
