package com.portfolio.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CertificationRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Issuing organization is required")
    private String issuingOrg;

    private String credentialId;
    private String credentialUrl;
    private String badgeUrl;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    private LocalDate expiryDate;
    private Integer sortOrder;
}
