package com.portfolio.service;

import com.portfolio.dto.request.BlogPostRequest;
import com.portfolio.entity.BlogPost;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlogPostService {

    private final BlogPostRepository repository;

    public List<BlogPost> getPublished() {
        return repository.findByPublishedTrueOrderByCreatedAtDesc();
    }

    public List<BlogPost> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public BlogPost getBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("BlogPost", "slug", slug));
    }

    public BlogPost getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BlogPost", "id", id));
    }

    public BlogPost create(BlogPostRequest request) {
        String slug = generateSlug(request.getTitle());

        BlogPost post = BlogPost.builder()
                .title(request.getTitle())
                .slug(slug)
                .content(request.getContent())
                .excerpt(request.getExcerpt())
                .coverImage(request.getCoverImage())
                .published(request.getPublished() != null ? request.getPublished() : false)
                .tags(request.getTags())
                .build();
        return repository.save(post);
    }

    public BlogPost update(UUID id, BlogPostRequest request) {
        BlogPost post = getById(id);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setCoverImage(request.getCoverImage());
        if (request.getPublished() != null) post.setPublished(request.getPublished());
        if (request.getTags() != null) post.setTags(request.getTags());

        // Regenerate slug if title changed
        if (!post.getTitle().equals(request.getTitle())) {
            post.setSlug(generateSlug(request.getTitle()));
        }

        return repository.save(post);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("BlogPost", "id", id);
        }
        repository.deleteById(id);
    }

    private String generateSlug(String title) {
        String slug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");

        if (repository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 6);
        }

        return slug;
    }
}
