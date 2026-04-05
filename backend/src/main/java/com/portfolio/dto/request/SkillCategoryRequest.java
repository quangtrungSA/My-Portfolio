package com.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SkillCategoryRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String color;

    private Integer sortOrder;
}
