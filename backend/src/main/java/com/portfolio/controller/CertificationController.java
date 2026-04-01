package com.portfolio.controller;

import com.portfolio.dto.request.CertificationRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Certification;
import com.portfolio.service.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;

    @GetMapping("/api/certifications")
    public ResponseEntity<ApiResponse<List<Certification>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(certificationService.getAll()));
    }

    @PostMapping("/api/admin/certifications")
    public ResponseEntity<ApiResponse<Certification>> create(@Valid @RequestBody CertificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certification created", certificationService.create(request)));
    }

    @PutMapping("/api/admin/certifications/{id}")
    public ResponseEntity<ApiResponse<Certification>> update(@PathVariable UUID id,
                                                              @Valid @RequestBody CertificationRequest request) {
        return ResponseEntity.ok(ApiResponse.success(certificationService.update(id, request)));
    }

    @DeleteMapping("/api/admin/certifications/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        certificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
