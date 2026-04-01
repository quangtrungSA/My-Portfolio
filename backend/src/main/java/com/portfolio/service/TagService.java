package com.portfolio.service;

import com.portfolio.dto.request.TagRequest;
import com.portfolio.entity.Tag;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository repository;

    public List<Tag> getAll() {
        return repository.findAll();
    }

    public Tag getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));
    }

    public Tag getBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "slug", slug));
    }

    public Tag create(TagRequest request) {
        Tag tag = Tag.builder()
                .name(request.getName())
                .slug(generateSlug(request.getName()))
                .color(request.getColor())
                .build();
        return repository.save(tag);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Tag", "id", id);
        }
        repository.deleteById(id);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
