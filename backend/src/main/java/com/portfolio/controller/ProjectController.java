package com.portfolio.controller;

import com.portfolio.dto.request.ProjectRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Project;
import com.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/api/projects")
    public ResponseEntity<ApiResponse<List<Project>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(projectService.getAll()));
    }

    @GetMapping("/api/projects/featured")
    public ResponseEntity<ApiResponse<List<Project>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success(projectService.getFeatured()));
    }

    @PostMapping("/api/admin/projects")
    public ResponseEntity<ApiResponse<Project>> create(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created", projectService.create(request)));
    }

    @PutMapping("/api/admin/projects/{id}")
    public ResponseEntity<ApiResponse<Project>> update(@PathVariable UUID id,
                                                        @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.success(projectService.update(id, request)));
    }

    @DeleteMapping("/api/admin/projects/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
