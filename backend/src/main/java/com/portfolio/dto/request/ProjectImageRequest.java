package com.portfolio.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.UUID;

@Data
public class ProjectImageRequest {
    @NotNull(message = "Project ID is required")
    private UUID projectId;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private String caption;
    private Boolean isPrimary;
    private Integer sortOrder;
}
