package com.portfolio.service;

import com.portfolio.dto.request.EducationRequest;
import com.portfolio.entity.Education;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EducationService {

    private final EducationRepository repository;

    public List<Education> getAll() {
        return repository.findAllByOrderBySortOrderAscStartDateDesc();
    }

    public Education getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education", "id", id));
    }

    public Education create(EducationRequest request) {
        Education edu = Education.builder()
                .institution(request.getInstitution())
                .degree(request.getDegree())
                .field(request.getField())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        return repository.save(edu);
    }

    public Education update(UUID id, EducationRequest request) {
        Education edu = getById(id);
        edu.setInstitution(request.getInstitution());
        edu.setDegree(request.getDegree());
        edu.setField(request.getField());
        edu.setStartDate(request.getStartDate());
        edu.setEndDate(request.getEndDate());
        edu.setDescription(request.getDescription());
        edu.setLogoUrl(request.getLogoUrl());
        if (request.getSortOrder() != null) edu.setSortOrder(request.getSortOrder());
        return repository.save(edu);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Education", "id", id);
        }
        repository.deleteById(id);
    }
}
