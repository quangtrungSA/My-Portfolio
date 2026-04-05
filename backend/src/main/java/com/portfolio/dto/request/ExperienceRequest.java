package com.portfolio.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class ExperienceRequest {
    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Position is required")
    private String position;

    private String projectName;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;
    private String goal;
    private String[] technologies;
    private String logoUrl;
    private Integer sortOrder;
    
    @Valid
    private List<ExperiencePhaseRequest> phases = new ArrayList<>();
}
