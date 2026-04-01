package com.portfolio.controller;

import com.portfolio.dto.request.EducationRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Education;
import com.portfolio.service.EducationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @GetMapping("/api/education")
    public ResponseEntity<ApiResponse<List<Education>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(educationService.getAll()));
    }

    @PostMapping("/api/admin/education")
    public ResponseEntity<ApiResponse<Education>> create(@Valid @RequestBody EducationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Education created", educationService.create(request)));
    }

    @PutMapping("/api/admin/education/{id}")
    public ResponseEntity<ApiResponse<Education>> update(@PathVariable UUID id,
                                                          @Valid @RequestBody EducationRequest request) {
        return ResponseEntity.ok(ApiResponse.success(educationService.update(id, request)));
    }

    @DeleteMapping("/api/admin/education/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        educationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
