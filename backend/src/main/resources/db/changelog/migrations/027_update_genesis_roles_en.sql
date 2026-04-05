--liquibase formatted sql

--changeset portfolio:027-update-genesis-roles-en runOnChange:false splitStatements:false
--comment: Update Genesis Project roles to English
DO $$
DECLARE
    p_id UUID;
BEGIN
    SELECT ep.id INTO p_id
    FROM experience_phases ep
    JOIN experiences e ON e.id = ep.experience_id
    WHERE e.company ILIKE '%mgm%'
      AND e.project_name = 'Genesis Project'
    LIMIT 1;

    IF p_id IS NOT NULL THEN
        DELETE FROM experience_roles WHERE phase_id = p_id;

        INSERT INTO experience_roles (id, phase_id, name, description, sort_order, created_at, updated_at)
        VALUES
        (gen_random_uuid(), p_id, 'Work within a Scrum team in an international environment', '', 0, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Discuss with BA on customer requirements, analyze and produce technical design', '', 1, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Implement backend REST services with Java & Spring Boot based on requirements and system design', '', 2, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Take primary responsibility for designing and integrating third-party AI services', '', 3, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Implement React frontend with TypeScript using the A12 platform, following Figma designs and customer feedback', '', 4, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Set up Azure DevOps pipelines, write and customize CI/CD workflows, create Docker and Jenkins configurations', '', 5, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Participate in client-facing workshops to align on technical direction and present solution approaches to international stakeholders', '', 6, NOW(), NOW());
    END IF;
END $$;
