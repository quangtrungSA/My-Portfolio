--liquibase formatted sql

--changeset portfolio:026-update-genesis-roles runOnChange:false splitStatements:false
--comment: Replace Genesis Project roles with updated descriptions
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
        (gen_random_uuid(), p_id, 'Work with scrum team trong môi trường quốc tế', '', 0, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Discuss với BA về requirement của khách hàng, phân tích và lên design thiết kế', '', 1, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Triển khai Backend dựa trên requirement và thiết kế với Java và Spring Boot', '', 2, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Chịu trách nhiệm chính cho thiết kế và tích hợp AI service bên thứ ba', '', 3, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Triển khai Frontend bằng ReactJS với sự hỗ trợ từ A12 platform theo thiết kế Figma và phản hồi khách hàng', '', 4, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Triển khai Azure DevOps, viết và customize CI/CD pipeline, tạo cấu hình Docker và Jenkins', '', 5, NOW(), NOW()),
        (gen_random_uuid(), p_id, 'Tham gia thảo luận với khách hàng về hướng đi kỹ thuật, đưa ra solution thuyết phục cho các stakeholder quốc tế', '', 6, NOW(), NOW());
    END IF;
END $$;
