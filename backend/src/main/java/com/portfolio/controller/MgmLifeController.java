package com.portfolio.controller;

import com.portfolio.dto.request.MgmLifeItemRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.MgmLifeItem;
import com.portfolio.service.MgmLifeItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class MgmLifeController {

    private final MgmLifeItemService mgmLifeItemService;

    @GetMapping("/api/mgm-life")
    public ResponseEntity<ApiResponse<List<MgmLifeItem>>> getPublished() {
        return ResponseEntity.ok(ApiResponse.success(mgmLifeItemService.getPublished()));
    }

    @GetMapping("/api/admin/mgm-life")
    public ResponseEntity<ApiResponse<List<MgmLifeItem>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(mgmLifeItemService.getAll()));
    }

    @PostMapping("/api/admin/mgm-life")
    public ResponseEntity<ApiResponse<MgmLifeItem>> create(@Valid @RequestBody MgmLifeItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("MGM Life item created", mgmLifeItemService.create(request)));
    }

    @PutMapping("/api/admin/mgm-life/{id}")
    public ResponseEntity<ApiResponse<MgmLifeItem>> update(@PathVariable UUID id,
                                                            @Valid @RequestBody MgmLifeItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success(mgmLifeItemService.update(id, request)));
    }

    @DeleteMapping("/api/admin/mgm-life/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        mgmLifeItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
