package com.portfolio.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TagRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String color;
}
