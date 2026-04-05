package com.portfolio.service;

import com.portfolio.dto.request.SkillCategoryRequest;
import com.portfolio.entity.SkillCategory;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.SkillCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SkillCategoryService {

    private final SkillCategoryRepository repository;

    public List<SkillCategory> getAll() {
        return repository.findAllByOrderBySortOrder();
    }

    public SkillCategory getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", id));
    }

    public SkillCategory create(SkillCategoryRequest request) {
        SkillCategory category = SkillCategory.builder()
                .name(request.getName())
                .color(request.getColor())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        return repository.save(category);
    }

    public SkillCategory update(UUID id, SkillCategoryRequest request) {
        SkillCategory category = getById(id);
        category.setName(request.getName());
        category.setColor(request.getColor());
        if (request.getSortOrder() != null) {
            category.setSortOrder(request.getSortOrder());
        }
        return repository.save(category);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("SkillCategory", "id", id);
        }
        repository.deleteById(id);
    }
}
