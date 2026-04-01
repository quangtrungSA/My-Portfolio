package com.portfolio.controller;

import com.portfolio.dto.request.SiteSettingRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.SiteSetting;
import com.portfolio.service.SiteSettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SiteSettingController {

    private final SiteSettingService siteSettingService;

    @GetMapping("/api/admin/settings")
    public ResponseEntity<ApiResponse<List<SiteSetting>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(siteSettingService.getAll()));
    }

    @GetMapping("/api/admin/settings/{key}")
    public ResponseEntity<ApiResponse<SiteSetting>> getByKey(@PathVariable String key) {
        return ResponseEntity.ok(ApiResponse.success(siteSettingService.getByKey(key)));
    }

    @PutMapping("/api/admin/settings")
    public ResponseEntity<ApiResponse<SiteSetting>> upsert(@Valid @RequestBody SiteSettingRequest request) {
        return ResponseEntity.ok(ApiResponse.success(siteSettingService.upsert(request)));
    }
}
