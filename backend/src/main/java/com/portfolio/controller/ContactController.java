package com.portfolio.controller;

import com.portfolio.dto.request.ContactRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.entity.Contact;
import com.portfolio.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    // Public
    @PostMapping("/api/contacts")
    public ResponseEntity<ApiResponse<Contact>> create(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent successfully", contactService.create(request)));
    }

    // Admin
    @GetMapping("/api/admin/contacts")
    public ResponseEntity<ApiResponse<List<Contact>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(contactService.getAll()));
    }

    @GetMapping("/api/admin/contacts/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", contactService.getUnreadCount())));
    }

    @PutMapping("/api/admin/contacts/{id}/read")
    public ResponseEntity<ApiResponse<Contact>> toggleRead(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(contactService.toggleRead(id)));
    }

    @DeleteMapping("/api/admin/contacts/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
