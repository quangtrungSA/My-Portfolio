package com.portfolio.controller;

import com.portfolio.dto.request.SkillCategoryRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.SkillCategory;
import com.portfolio.service.SkillCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SkillCategoryController {

    private final SkillCategoryService skillCategoryService;

    @GetMapping("/api/skill-categories")
    public ResponseEntity<ApiResponse<List<SkillCategory>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(skillCategoryService.getAll()));
    }

    @PostMapping("/api/admin/skill-categories")
    public ResponseEntity<ApiResponse<SkillCategory>> create(
            @Valid @RequestBody SkillCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillCategoryService.create(request)));
    }

    @PutMapping("/api/admin/skill-categories/{id}")
    public ResponseEntity<ApiResponse<SkillCategory>> update(
            @PathVariable UUID id,
            @Valid @RequestBody SkillCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillCategoryService.update(id, request)));
    }

    @DeleteMapping("/api/admin/skill-categories/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        skillCategoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
