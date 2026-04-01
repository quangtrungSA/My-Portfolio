package com.portfolio.service;

import com.portfolio.dto.request.TestimonialRequest;
import com.portfolio.entity.Testimonial;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.TestimonialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final TestimonialRepository repository;

    public List<Testimonial> getAll() {
        return repository.findAllByOrderBySortOrder();
    }

    public List<Testimonial> getFeatured() {
        return repository.findByFeaturedTrueOrderBySortOrder();
    }

    public Testimonial getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial", "id", id));
    }

    public Testimonial create(TestimonialRequest request) {
        Testimonial testimonial = Testimonial.builder()
                .authorName(request.getAuthorName())
                .authorTitle(request.getAuthorTitle())
                .authorAvatar(request.getAuthorAvatar())
                .content(request.getContent())
                .rating(request.getRating())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        return repository.save(testimonial);
    }

    public Testimonial update(UUID id, TestimonialRequest request) {
        Testimonial testimonial = getById(id);
        testimonial.setAuthorName(request.getAuthorName());
        testimonial.setAuthorTitle(request.getAuthorTitle());
        testimonial.setAuthorAvatar(request.getAuthorAvatar());
        testimonial.setContent(request.getContent());
        testimonial.setRating(request.getRating());
        if (request.getFeatured() != null) testimonial.setFeatured(request.getFeatured());
        if (request.getSortOrder() != null) testimonial.setSortOrder(request.getSortOrder());
        return repository.save(testimonial);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Testimonial", "id", id);
        }
        repository.deleteById(id);
    }
}
