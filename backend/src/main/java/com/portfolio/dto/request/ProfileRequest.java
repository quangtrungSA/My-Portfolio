package com.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class ProfileRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Title is required")
    private String title;

    private String bio;
    private String avatarUrl;
    private String resumeUrl;
    private Map<String, String> socialLinks;
    private String location;
    private String email;
    private String phone;
    private String metaTitle;
    private String metaDescription;
    private String ogImageUrl;
    private String tagline;
    private Boolean availableForHire;
}
