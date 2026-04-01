package com.portfolio.controller;

import com.portfolio.dto.request.TagRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Tag;
import com.portfolio.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping("/api/tags")
    public ResponseEntity<ApiResponse<List<Tag>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(tagService.getAll()));
    }

    @PostMapping("/api/admin/tags")
    public ResponseEntity<ApiResponse<Tag>> create(@Valid @RequestBody TagRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tag created", tagService.create(request)));
    }

    @DeleteMapping("/api/admin/tags/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
