--liquibase formatted sql

--changeset portfolio:021-experience-sort-order-fn runOnChange:true
--comment: Function to auto-assign sort_order based on start_date ASC (earliest project first)
CREATE OR REPLACE FUNCTION fn_experience_sort_order()
RETURNS TRIGGER AS $$
BEGIN
    IF pg_trigger_depth() > 1 THEN
        RETURN NULL;
    END IF;
    UPDATE experiences
    SET sort_order = ranked.rn
    FROM (
        SELECT id, (ROW_NUMBER() OVER (ORDER BY start_date ASC) - 1) AS rn
        FROM experiences
    ) ranked
    WHERE experiences.id = ranked.id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

--changeset portfolio:021-experience-sort-order-trigger runOnChange:true
--comment: Trigger fires after insert/update of start_date to rerank all experiences
DROP TRIGGER IF EXISTS trg_experience_sort_order ON experiences;
CREATE TRIGGER trg_experience_sort_order
    AFTER INSERT OR UPDATE OF start_date ON experiences
    FOR EACH STATEMENT EXECUTE FUNCTION fn_experience_sort_order();

--changeset portfolio:021-experience-sort-order-init runOnChange:false
--comment: Initial sort_order assignment for existing rows
UPDATE experiences
SET sort_order = ranked.rn
FROM (
    SELECT id, (ROW_NUMBER() OVER (ORDER BY start_date ASC) - 1) AS rn
    FROM experiences
) ranked
WHERE experiences.id = ranked.id;
