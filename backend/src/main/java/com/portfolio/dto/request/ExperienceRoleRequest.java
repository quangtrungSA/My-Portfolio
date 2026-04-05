package com.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ExperienceRoleRequest {
    @NotBlank(message = "Role name is required")
    private String name;
    
    private String description;
    private Integer sortOrder;
}

