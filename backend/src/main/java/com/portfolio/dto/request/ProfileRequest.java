package com.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Title is required")
    private String title;

    private String bio;
    private String avatarUrl;
    private String resumeUrl;
    
    // Individual social link fields
    private String githubUrl;
    private String linkedinUrl;
    private String facebookUrl;
    private String instagramUrl;
    private String leetcodeUrl;
    private String dailydevUrl;
    private String redditUrl;
    private String twitterUrl;
    private String websiteUrl;
    
    private String location;
    private String email;
    private String phone;
    private String metaTitle;
    private String metaDescription;
    private String ogImageUrl;
    private String tagline;
    private Boolean availableForHire;
    private String careerSummary;
    private String internationalClients;
}
