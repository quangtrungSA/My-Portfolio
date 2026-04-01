package com.portfolio.repository;

import com.portfolio.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {
    Optional<BlogPost> findBySlug(String slug);
    List<BlogPost> findByPublishedTrueOrderByCreatedAtDesc();
    List<BlogPost> findAllByOrderByCreatedAtDesc();
    boolean existsBySlug(String slug);
}
