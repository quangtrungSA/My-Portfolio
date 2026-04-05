package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    // Individual social link columns
    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    @Column(name = "facebook_url", length = 500)
    private String facebookUrl;

    @Column(name = "instagram_url", length = 500)
    private String instagramUrl;

    @Column(name = "leetcode_url", length = 500)
    private String leetcodeUrl;

    @Column(name = "dailydev_url", length = 500)
    private String dailydevUrl;

    @Column(name = "reddit_url", length = 500)
    private String redditUrl;

    @Column(name = "twitter_url", length = 500)
    private String twitterUrl;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(length = 200)
    private String location;

    @Column(length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(name = "meta_title", length = 200)
    private String metaTitle;

    @Column(name = "meta_description", length = 500)
    private String metaDescription;

    @Column(name = "og_image_url", length = 500)
    private String ogImageUrl;

    @Column(length = 300)
    private String tagline;

    @Column(name = "available_for_hire")
    @Builder.Default
    private Boolean availableForHire = false;

    @Column(name = "career_summary", columnDefinition = "TEXT")
    private String careerSummary;

    @Column(name = "international_clients", columnDefinition = "jsonb")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private String internationalClients;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
