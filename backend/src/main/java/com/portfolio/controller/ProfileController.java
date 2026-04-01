package com.portfolio.controller;

import com.portfolio.dto.request.ProfileRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Profile;
import com.portfolio.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/api/profiles")
    public ResponseEntity<ApiResponse<List<Profile>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(profileService.getAll()));
    }

    @PutMapping("/api/admin/profiles/{id}")
    public ResponseEntity<ApiResponse<Profile>> update(@PathVariable UUID id,
                                                        @Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(profileService.update(id, request)));
    }
}
