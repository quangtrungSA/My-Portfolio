package com.portfolio.repository;

import com.portfolio.entity.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TestimonialRepository extends JpaRepository<Testimonial, UUID> {
    List<Testimonial> findAllByOrderBySortOrder();
    List<Testimonial> findByFeaturedTrueOrderBySortOrder();
}
