package com.portfolio.service;

import com.portfolio.dto.request.ExperienceRequest;
import com.portfolio.entity.Experience;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository repository;

    public List<Experience> getAll() {
        return repository.findAllByOrderBySortOrderAscStartDateDesc();
    }

    public Experience getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
    }

    public Experience create(ExperienceRequest request) {
        Experience exp = Experience.builder()
                .company(request.getCompany())
                .position(request.getPosition())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        return repository.save(exp);
    }

    public Experience update(UUID id, ExperienceRequest request) {
        Experience exp = getById(id);
        exp.setCompany(request.getCompany());
        exp.setPosition(request.getPosition());
        exp.setStartDate(request.getStartDate());
        exp.setEndDate(request.getEndDate());
        exp.setDescription(request.getDescription());
        exp.setLogoUrl(request.getLogoUrl());
        if (request.getSortOrder() != null) exp.setSortOrder(request.getSortOrder());
        return repository.save(exp);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Experience", "id", id);
        }
        repository.deleteById(id);
    }
}
