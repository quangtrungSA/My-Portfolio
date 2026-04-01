package com.portfolio.controller;

import com.portfolio.dto.request.TestimonialRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Testimonial;
import com.portfolio.service.TestimonialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TestimonialController {

    private final TestimonialService testimonialService;

    @GetMapping("/api/testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getAll()));
    }

    @GetMapping("/api/testimonials/featured")
    public ResponseEntity<ApiResponse<List<Testimonial>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getFeatured()));
    }

    @PostMapping("/api/admin/testimonials")
    public ResponseEntity<ApiResponse<Testimonial>> create(@Valid @RequestBody TestimonialRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Testimonial created", testimonialService.create(request)));
    }

    @PutMapping("/api/admin/testimonials/{id}")
    public ResponseEntity<ApiResponse<Testimonial>> update(@PathVariable UUID id,
                                                            @Valid @RequestBody TestimonialRequest request) {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.update(id, request)));
    }

    @DeleteMapping("/api/admin/testimonials/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        testimonialService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
