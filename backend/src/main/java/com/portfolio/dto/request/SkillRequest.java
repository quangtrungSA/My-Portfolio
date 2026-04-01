package com.portfolio.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SkillRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Proficiency level is required")
    @Min(value = 1, message = "Proficiency must be at least 1")
    @Max(value = 100, message = "Proficiency must be at most 100")
    private Integer proficiencyLevel;

    private String icon;
    private Integer sortOrder;
}
