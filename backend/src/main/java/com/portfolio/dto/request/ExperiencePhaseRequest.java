package com.portfolio.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class ExperiencePhaseRequest {
    @NotBlank(message = "Phase name is required")
    private String name;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer teamSize;
    private Integer sortOrder;
    
    @Valid
    private List<ExperienceRoleRequest> roles = new ArrayList<>();
}

