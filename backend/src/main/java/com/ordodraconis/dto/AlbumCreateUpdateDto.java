package com.ordodraconis.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AlbumCreateUpdateDto {
    @NotBlank
    private String titleSrCyrl;
    private String titleSrLatn;
    private String titleEn;
    
    private String descriptionSrCyrl;
    private String descriptionSrLatn;
    private String descriptionEn;
    
    private List<String> images = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private LocalDateTime eventDate;
    private Boolean generateEn = false;
    
    // Getters and Setters
    public String getTitleSrCyrl() {
        return titleSrCyrl;
    }
    
    public void setTitleSrCyrl(String titleSrCyrl) {
        this.titleSrCyrl = titleSrCyrl;
    }
    
    public String getTitleSrLatn() {
        return titleSrLatn;
    }
    
    public void setTitleSrLatn(String titleSrLatn) {
        this.titleSrLatn = titleSrLatn;
    }
    
    public String getTitleEn() {
        return titleEn;
    }
    
    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }
    
    public String getDescriptionSrCyrl() {
        return descriptionSrCyrl;
    }
    
    public void setDescriptionSrCyrl(String descriptionSrCyrl) {
        this.descriptionSrCyrl = descriptionSrCyrl;
    }
    
    public String getDescriptionSrLatn() {
        return descriptionSrLatn;
    }
    
    public void setDescriptionSrLatn(String descriptionSrLatn) {
        this.descriptionSrLatn = descriptionSrLatn;
    }
    
    public String getDescriptionEn() {
        return descriptionEn;
    }
    
    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }
    
    public List<String> getImages() {
        return images;
    }
    
    public void setImages(List<String> images) {
        this.images = images != null ? images : new ArrayList<>();
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags != null ? tags : new ArrayList<>();
    }
    
    public LocalDateTime getEventDate() {
        return eventDate;
    }
    
    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }
    
    public Boolean getGenerateEn() {
        return generateEn;
    }
    
    public void setGenerateEn(Boolean generateEn) {
        this.generateEn = generateEn;
    }
}
