package com.portfolio.controller;

import com.portfolio.dto.request.ExperienceRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Experience;
import com.portfolio.service.ExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService experienceService;

    @GetMapping("/api/experiences")
    public ResponseEntity<ApiResponse<List<Experience>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(experienceService.getAll()));
    }

    @PostMapping("/api/admin/experiences")
    public ResponseEntity<ApiResponse<Experience>> create(@Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Experience created", experienceService.create(request)));
    }

    @PutMapping("/api/admin/experiences/{id}")
    public ResponseEntity<ApiResponse<Experience>> update(@PathVariable UUID id,
                                                           @Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(ApiResponse.success(experienceService.update(id, request)));
    }

    @DeleteMapping("/api/admin/experiences/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        experienceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
