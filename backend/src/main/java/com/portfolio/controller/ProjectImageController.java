package com.portfolio.controller;

import com.portfolio.dto.request.ProjectImageRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.ProjectImage;
import com.portfolio.service.ProjectImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ProjectImageController {

    private final ProjectImageService projectImageService;

    @GetMapping("/api/projects/{projectId}/images")
    public ResponseEntity<ApiResponse<List<ProjectImage>>> getByProjectId(@PathVariable UUID projectId) {
        return ResponseEntity.ok(ApiResponse.success(projectImageService.getByProjectId(projectId)));
    }

    @PostMapping("/api/admin/project-images")
    public ResponseEntity<ApiResponse<ProjectImage>> create(@Valid @RequestBody ProjectImageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project image created", projectImageService.create(request)));
    }

    @DeleteMapping("/api/admin/project-images/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        projectImageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
