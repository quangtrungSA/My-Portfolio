package com.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MgmLifeItemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Pattern(regexp = "IMAGE|VIDEO", message = "Media type must be IMAGE or VIDEO")
    private String mediaType;

    private String mediaUrl;

    private String thumbnailUrl;

    @Pattern(regexp = "ENGLISH_CLASS|HAPPY_FRIDAY|COMPANY_OVERVIEW|GENERAL",
             message = "Category must be ENGLISH_CLASS, HAPPY_FRIDAY, COMPANY_OVERVIEW or GENERAL")
    private String category;

    private Integer sortOrder;

    private Boolean published;
}
