package com.portfolio.controller;

import com.portfolio.dto.request.SkillRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Skill;
import com.portfolio.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping("/api/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getAll(
            @RequestParam(required = false) String category) {
        List<Skill> skills = category != null
                ? skillService.getByCategory(category)
                : skillService.getAll();
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @PostMapping("/api/admin/skills")
    public ResponseEntity<ApiResponse<Skill>> create(@Valid @RequestBody SkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Skill created", skillService.create(request)));
    }

    @PutMapping("/api/admin/skills/{id}")
    public ResponseEntity<ApiResponse<Skill>> update(@PathVariable UUID id,
                                                      @Valid @RequestBody SkillRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillService.update(id, request)));
    }

    @DeleteMapping("/api/admin/skills/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        skillService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
