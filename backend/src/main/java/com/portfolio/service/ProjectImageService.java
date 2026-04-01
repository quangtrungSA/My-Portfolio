package com.portfolio.service;

import com.portfolio.dto.request.ProjectImageRequest;
import com.portfolio.entity.ProjectImage;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ProjectImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectImageService {

    private final ProjectImageRepository repository;

    public List<ProjectImage> getByProjectId(UUID projectId) {
        return repository.findByProjectIdOrderBySortOrder(projectId);
    }

    public ProjectImage create(ProjectImageRequest request) {
        ProjectImage image = ProjectImage.builder()
                .projectId(request.getProjectId())
                .imageUrl(request.getImageUrl())
                .caption(request.getCaption())
                .isPrimary(request.getIsPrimary() != null ? request.getIsPrimary() : false)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        return repository.save(image);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("ProjectImage", "id", id);
        }
        repository.deleteById(id);
    }
}
