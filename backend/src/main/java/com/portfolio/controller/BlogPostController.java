package com.portfolio.controller;

import com.portfolio.dto.request.BlogPostRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.BlogPost;
import com.portfolio.service.BlogPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;

    // Public endpoints
    @GetMapping("/api/blog-posts")
    public ResponseEntity<ApiResponse<List<BlogPost>>> getPublished() {
        return ResponseEntity.ok(ApiResponse.success(blogPostService.getPublished()));
    }

    @GetMapping("/api/blog-posts/{slug}")
    public ResponseEntity<ApiResponse<BlogPost>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(blogPostService.getBySlug(slug)));
    }

    // Admin endpoints
    @GetMapping("/api/admin/blog-posts")
    public ResponseEntity<ApiResponse<List<BlogPost>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(blogPostService.getAll()));
    }

    @PostMapping("/api/admin/blog-posts")
    public ResponseEntity<ApiResponse<BlogPost>> create(@Valid @RequestBody BlogPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Blog post created", blogPostService.create(request)));
    }

    @PutMapping("/api/admin/blog-posts/{id}")
    public ResponseEntity<ApiResponse<BlogPost>> update(@PathVariable UUID id,
                                                         @Valid @RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(ApiResponse.success(blogPostService.update(id, request)));
    }

    @DeleteMapping("/api/admin/blog-posts/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        blogPostService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
