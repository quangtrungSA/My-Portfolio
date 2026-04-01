package com.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String imageUrl;
    private String[] techStack;
    private String githubUrl;
    private String liveUrl;
    private Boolean featured;
    private Integer sortOrder;
    private String category;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String clientName;
}
