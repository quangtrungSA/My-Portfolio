package com.portfolio.service;

import com.portfolio.dto.request.ProjectRequest;
import com.portfolio.entity.Project;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository repository;

    public List<Project> getAll() {
        return repository.findAllByOrderBySortOrder();
    }

    public List<Project> getFeatured() {
        return repository.findByFeaturedTrueOrderBySortOrder();
    }

    public Project getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
    }

    public Project create(ProjectRequest request) {
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .techStack(request.getTechStack())
                .githubUrl(request.getGithubUrl())
                .liveUrl(request.getLiveUrl())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .category(request.getCategory())
                .status(request.getStatus() != null ? request.getStatus() : "completed")
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .clientName(request.getClientName())
                .build();
        return repository.save(project);
    }

    public Project update(UUID id, ProjectRequest request) {
        Project project = getById(id);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setImageUrl(request.getImageUrl());
        project.setTechStack(request.getTechStack());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveUrl(request.getLiveUrl());
        if (request.getFeatured() != null) project.setFeatured(request.getFeatured());
        if (request.getSortOrder() != null) project.setSortOrder(request.getSortOrder());
        project.setCategory(request.getCategory());
        project.setStatus(request.getStatus());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setClientName(request.getClientName());
        return repository.save(project);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        repository.deleteById(id);
    }
}
