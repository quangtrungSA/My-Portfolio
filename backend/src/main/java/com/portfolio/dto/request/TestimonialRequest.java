package com.portfolio.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TestimonialRequest {
    @NotBlank(message = "Author name is required")
    private String authorName;

    private String authorTitle;
    private String authorAvatar;

    @NotBlank(message = "Content is required")
    private String content;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    private Boolean featured;
    private Integer sortOrder;
}
