package com.portfolio.repository;

import com.portfolio.entity.ProjectImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, UUID> {
    List<ProjectImage> findByProjectIdOrderBySortOrder(UUID projectId);
    void deleteByProjectId(UUID projectId);
}
