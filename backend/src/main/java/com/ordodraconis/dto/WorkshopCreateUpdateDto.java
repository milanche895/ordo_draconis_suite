package com.ordodraconis.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class WorkshopCreateUpdateDto {
    @NotBlank
    private String titleSrCyrl;
    private String titleSrLatn;
    private String titleEn;
    
    @NotBlank
    private String descriptionSrCyrl;
    private String descriptionSrLatn;
    private String descriptionEn;
    
    private String contentSrCyrl;
    private String contentSrLatn;
    private String contentEn;
    
    private String coverImage;
    private List<String> galleryImages = new ArrayList<>();
    
    private Integer duration;
    private Integer maxParticipants;
    private BigDecimal price;
    private String currency;
    
    private boolean active = true;
    private Boolean generateEn = false;
    
    // Getters and Setters
    public String getTitleSrCyrl() { return titleSrCyrl; }
    public void setTitleSrCyrl(String titleSrCyrl) { this.titleSrCyrl = titleSrCyrl; }
    
    public String getTitleSrLatn() { return titleSrLatn; }
    public void setTitleSrLatn(String titleSrLatn) { this.titleSrLatn = titleSrLatn; }
    
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    
    public String getDescriptionSrCyrl() { return descriptionSrCyrl; }
    public void setDescriptionSrCyrl(String descriptionSrCyrl) { this.descriptionSrCyrl = descriptionSrCyrl; }
    
    public String getDescriptionSrLatn() { return descriptionSrLatn; }
    public void setDescriptionSrLatn(String descriptionSrLatn) { this.descriptionSrLatn = descriptionSrLatn; }
    
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    
    public String getContentSrCyrl() { return contentSrCyrl; }
    public void setContentSrCyrl(String contentSrCyrl) { this.contentSrCyrl = contentSrCyrl; }
    
    public String getContentSrLatn() { return contentSrLatn; }
    public void setContentSrLatn(String contentSrLatn) { this.contentSrLatn = contentSrLatn; }
    
    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }
    
    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    
    public List<String> getGalleryImages() { return galleryImages; }
    public void setGalleryImages(List<String> galleryImages) { this.galleryImages = galleryImages; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public Boolean getGenerateEn() { return generateEn; }
    public void setGenerateEn(Boolean generateEn) { this.generateEn = generateEn; }
}
