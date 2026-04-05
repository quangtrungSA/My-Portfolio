package com.portfolio.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.UUID;

@Data
public class SkillRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Category is required")
    private UUID categoryId;

    private String icon;
    private Integer sortOrder;
}
