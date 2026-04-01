package com.portfolio.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SiteSettingRequest {
    @NotBlank(message = "Key is required")
    private String key;

    private String value;
    private String type = "string";
    private String description;
}
