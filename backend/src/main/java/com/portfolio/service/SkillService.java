package com.portfolio.service;

import com.portfolio.dto.request.SkillRequest;
import com.portfolio.entity.Skill;
import com.portfolio.entity.SkillCategory;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.SkillCategoryRepository;
import com.portfolio.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository repository;
    private final SkillCategoryRepository categoryRepository;

    public List<Skill> getAll() {
        return repository.findAllByOrderBySortOrder();
    }

    public List<Skill> getByCategoryId(UUID categoryId) {
        return repository.findByCategoryIdOrderBySortOrder(categoryId);
    }

    public Skill getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
    }

    public Skill create(SkillRequest request) {
        SkillCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", request.getCategoryId()));
        Skill skill = Skill.builder()
                .name(request.getName())
                .category(category)
                .icon(request.getIcon())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        return repository.save(skill);
    }

    public Skill update(UUID id, SkillRequest request) {
        Skill skill = getById(id);
        SkillCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", request.getCategoryId()));
        skill.setName(request.getName());
        skill.setCategory(category);
        skill.setIcon(request.getIcon());
        if (request.getSortOrder() != null) skill.setSortOrder(request.getSortOrder());
        return repository.save(skill);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Skill", "id", id);
        }
        repository.deleteById(id);
    }
}

