--liquibase formatted sql

--changeset portfolio:017-indexes runOnChange:false
--comment: Create all performance indexes
CREATE INDEX IF NOT EXISTS idx_skills_category_id        ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skill_categories_sort     ON skill_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured         ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category         ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status           ON projects(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug           ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published      ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_contacts_read             ON contacts(read);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at       ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certifications_sort       ON certifications(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured     ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_project_images_project    ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag        ON blog_post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_key         ON site_settings(key);
