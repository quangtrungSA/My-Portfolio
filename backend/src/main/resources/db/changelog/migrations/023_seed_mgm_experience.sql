--liquibase formatted sql

--changeset portfolio:023-freelance-update-enddate runOnChange:false
--comment: Update Freelance Developer end date to 2025-12-31
UPDATE experiences
SET end_date   = '2025-12-31',
    updated_at = NOW()
WHERE company ILIKE '%freelance%'
  AND (end_date IS NULL OR end_date > '2025-12-31');

--changeset portfolio:023-mgm-genesis-project runOnChange:false
--comment: Insert mgm Technologies Partner - Genesis Project experience
DO $$
DECLARE
    exp1_id   UUID := gen_random_uuid();
    phase1_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO experiences
        (id, company, position, project_name,
         start_date, end_date, goal, technologies, logo_url,
         sort_order, created_at, updated_at)
    VALUES (
        exp1_id,
        'mgm Technology Partners',
        'Full Stack Developer',
        'Genesis Project',
        '2026-01-01',
        '2026-04-01',
        'Build an AI-powered multi-tenant order management system for food ingredients. Uses AI services to generate personalized meal plans and recipe suggestions based on individual health goals (weight loss, nutritional improvement, etc.) for schools, hospitals and corporate offices (tenants) across Germany.',
        ARRAY['Java','Spring Boot','Gradle','React','TypeScript','Keycloak','AI Service','PostgreSQL','Azure DevOps'],
        '/images/logos/mgm.svg',
        0,
        NOW(), NOW()
    );

    INSERT INTO experience_phases
        (id, experience_id, name, start_date, end_date,
         team_size, sort_order, created_at, updated_at)
    VALUES (
        phase1_id,
        exp1_id,
        'Support Development',
        '2026-01-01',
        '2026-04-01',
        10,
        0,
        NOW(), NOW()
    );

    INSERT INTO experience_roles
        (id, phase_id, name, description, sort_order, created_at, updated_at)
    VALUES
    (
        gen_random_uuid(), phase1_id,
        'Full Stack Developer',
        'Discuss with BA on customer requirements, analyze and produce technical design; implement backend REST services with Java & Spring Boot based on business requirements and system design.',
        0, NOW(), NOW()
    ),
    (
        gen_random_uuid(), phase1_id,
        'AI Integration Lead',
        'Take primary responsibility for designing and integrating third-party AI services for personalized meal-planning and recipe-suggestion features, aligned with individual dietary goals and health conditions.',
        1, NOW(), NOW()
    ),
    (
        gen_random_uuid(), phase1_id,
        'Frontend Developer',
        'Implement React frontend with TypeScript using the A12 platform, following Figma designs provided by the design team and direct customer feedback.',
        2, NOW(), NOW()
    ),
    (
        gen_random_uuid(), phase1_id,
        'DevOps & CI/CD',
        'Set up Azure DevOps pipelines, write and customize CI/CD workflows, create Docker and Jenkins configurations to automate build, test and deployment processes.',
        3, NOW(), NOW()
    ),
    (
        gen_random_uuid(), phase1_id,
        'Technical Consultant',
        'Participate in client-facing workshops to align on technical direction; propose and present solution approaches to international stakeholders, bridging the Vietnam and German team.',
        4, NOW(), NOW()
    );
END $$;

--changeset portfolio:023-mgm-devops-project runOnChange:false
--comment: Insert mgm Technologies Partner - mgm VN DevOps Team experience
DO $$
DECLARE
    exp2_id   UUID := gen_random_uuid();
    phase2_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO experiences
        (id, company, position, project_name,
         start_date, end_date, goal, technologies, logo_url,
         sort_order, created_at, updated_at)
    VALUES (
        exp2_id,
        'mgm Technology Partners',
        'DevOps Engineer',
        'mgm VN DevOps Team',
        '2026-04-01',
        NULL,
        'Establish and maintain a robust DevOps infrastructure to support multiple product teams within mgm Technology Partners Vietnam office, improving deployment frequency, system reliability and developer productivity across all company projects.',
        ARRAY['Docker','Kubernetes','Azure DevOps','Jenkins','Terraform','Ansible','Prometheus','Grafana','Azure Cloud','Linux','Shell Scripting','Helm'],
        '/images/logos/mgm.svg',
        0,
        NOW(), NOW()
    );

    INSERT INTO experience_phases
        (id, experience_id, name, start_date, end_date,
         team_size, sort_order, created_at, updated_at)
    VALUES (
        phase2_id,
        exp2_id,
        'Development',
        '2026-04-01',
        NULL,
        10,
        0,
        NOW(), NOW()
    );

    INSERT INTO experience_roles
        (id, phase_id, name, description, sort_order, created_at, updated_at)
    VALUES
    (
        gen_random_uuid(), phase2_id,
        'CI/CD Pipeline Engineer',
        'Design, implement and maintain CI/CD pipelines using Azure DevOps and Jenkins for multiple internal product projects, ensuring fast, consistent and reliable software delivery across all teams.',
        0, NOW(), NOW()
    ),
    (
        gen_random_uuid(), phase2_id,
        'Container & Orchestration',
        'Containerize microservices with Docker and manage deployments on Kubernetes within Azure Cloud; maintain Helm charts for reproducible, environment-consistent rollouts across dev, staging and production.',
        1, NOW(), NOW()
    ),
    (
        gen_random_uuid(), phase2_id,
        'Monitoring & Observability',
        'Build and maintain monitoring and alerting stacks using Prometheus, Grafana and Azure Monitor; define SLOs and runbooks to ensure system reliability and rapid incident response.',
        2, NOW(), NOW()
    ),
    (
        gen_random_uuid(), phase2_id,
        'Infrastructure as Code',
        'Automate cloud infrastructure provisioning and configuration management on Azure using Terraform and Ansible, reducing manual operations and guaranteeing environment parity across all deployment stages.',
        3, NOW(), NOW()
    );
END $$;
