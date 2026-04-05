package com.portfolio.service;

import com.portfolio.dto.request.ExperiencePhaseRequest;
import com.portfolio.dto.request.ExperienceRequest;
import com.portfolio.dto.request.ExperienceRoleRequest;
import com.portfolio.entity.Experience;
import com.portfolio.entity.ExperiencePhase;
import com.portfolio.entity.ExperienceRole;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository repository;

    @Transactional(readOnly = true)
    public List<Experience> getAll() {
        return repository.findAllByOrderBySortOrderAscStartDateDesc();
    }

    @Transactional(readOnly = true)
    public Experience getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
    }

    @Transactional
    public Experience create(ExperienceRequest request) {
        Experience exp = Experience.builder()
                .company(request.getCompany())
                .position(request.getPosition())
                .projectName(request.getProjectName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .goal(request.getGoal())
                .technologies(request.getTechnologies() != null ? request.getTechnologies() : new String[0])
                .logoUrl(request.getLogoUrl())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        
        // Add phases
        if (request.getPhases() != null) {
            for (ExperiencePhaseRequest phaseReq : request.getPhases()) {
                ExperiencePhase phase = createPhase(phaseReq);
                exp.addPhase(phase);
            }
        }
        
        return repository.save(exp);
    }

    @Transactional
    public Experience update(UUID id, ExperienceRequest request) {
        Experience exp = getById(id);
        exp.setCompany(request.getCompany());
        exp.setPosition(request.getPosition());
        exp.setProjectName(request.getProjectName());
        exp.setStartDate(request.getStartDate());
        exp.setEndDate(request.getEndDate());
        exp.setGoal(request.getGoal());
        exp.setTechnologies(request.getTechnologies() != null ? request.getTechnologies() : new String[0]);
        exp.setLogoUrl(request.getLogoUrl());
        if (request.getSortOrder() != null) exp.setSortOrder(request.getSortOrder());
        
        // Clear existing phases and add new ones
        exp.clearPhases();
        if (request.getPhases() != null) {
            for (ExperiencePhaseRequest phaseReq : request.getPhases()) {
                ExperiencePhase phase = createPhase(phaseReq);
                exp.addPhase(phase);
            }
        }
        
        return repository.save(exp);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Experience", "id", id);
        }
        repository.deleteById(id);
    }
    
    private ExperiencePhase createPhase(ExperiencePhaseRequest request) {
        ExperiencePhase phase = ExperiencePhase.builder()
                .name(request.getName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .teamSize(request.getTeamSize())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        
        // Add roles
        if (request.getRoles() != null) {
            for (ExperienceRoleRequest roleReq : request.getRoles()) {
                ExperienceRole role = ExperienceRole.builder()
                        .name(roleReq.getName())
                        .description(roleReq.getDescription())
                        .sortOrder(roleReq.getSortOrder() != null ? roleReq.getSortOrder() : 0)
                        .build();
                phase.addRole(role);
            }
        }
        
        return phase;
    }
}
