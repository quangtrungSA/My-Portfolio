--liquibase formatted sql

--changeset portfolio:024-fix-experience-sort-order-fn runOnChange:true splitStatements:false
--comment: Fix sort_order trigger to rank by start_date DESC (newest first = sort_order 0)
CREATE OR REPLACE FUNCTION fn_experience_sort_order()
RETURNS TRIGGER AS $$
BEGIN
    IF pg_trigger_depth() > 1 THEN
        RETURN NULL;
    END IF;
    UPDATE experiences
    SET sort_order = ranked.rn
    FROM (
        SELECT id, (ROW_NUMBER() OVER (ORDER BY start_date DESC) - 1) AS rn
        FROM experiences
    ) ranked
    WHERE experiences.id = ranked.id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

--changeset portfolio:024-fix-experience-sort-order-rerank runOnChange:false
--comment: Re-rank all existing experiences with new DESC order
UPDATE experiences
SET sort_order = ranked.rn
FROM (
    SELECT id, (ROW_NUMBER() OVER (ORDER BY start_date DESC) - 1) AS rn
    FROM experiences
) ranked
WHERE experiences.id = ranked.id;
