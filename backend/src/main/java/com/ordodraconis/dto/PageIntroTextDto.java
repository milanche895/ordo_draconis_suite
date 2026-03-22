package com.ordodraconis.dto;

public class PageIntroTextDto {
    private String description;

    public PageIntroTextDto() {
    }

    public PageIntroTextDto(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
