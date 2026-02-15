package com.ordodraconis.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

public class NewsCreateUpdateDto {
    @NotBlank
    private String titleSrCyrl;
    private String titleSrLatn;
    private String titleEn;
    
    @NotBlank
    private String summarySrCyrl;
    private String summarySrLatn;
    private String summaryEn;
    
    @NotBlank
    private String contentSrCyrl;
    private String contentSrLatn;
    private String contentEn;
    
    private String coverImage;
    private List<String> galleryImages = new ArrayList<>();
    private String status; // DRAFT, PUBLISHED
    private Boolean generateEn = false; // Trigger EN translation
    
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
    
    public String getSummarySrCyrl() {
        return summarySrCyrl;
    }
    
    public void setSummarySrCyrl(String summarySrCyrl) {
        this.summarySrCyrl = summarySrCyrl;
    }
    
    public String getSummarySrLatn() {
        return summarySrLatn;
    }
    
    public void setSummarySrLatn(String summarySrLatn) {
        this.summarySrLatn = summarySrLatn;
    }
    
    public String getSummaryEn() {
        return summaryEn;
    }
    
    public void setSummaryEn(String summaryEn) {
        this.summaryEn = summaryEn;
    }
    
    public String getContentSrCyrl() {
        return contentSrCyrl;
    }
    
    public void setContentSrCyrl(String contentSrCyrl) {
        this.contentSrCyrl = contentSrCyrl;
    }
    
    public String getContentSrLatn() {
        return contentSrLatn;
    }
    
    public void setContentSrLatn(String contentSrLatn) {
        this.contentSrLatn = contentSrLatn;
    }
    
    public String getContentEn() {
        return contentEn;
    }
    
    public void setContentEn(String contentEn) {
        this.contentEn = contentEn;
    }
    
    public String getCoverImage() {
        return coverImage;
    }
    
    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }
    
    public List<String> getGalleryImages() {
        return galleryImages;
    }
    
    public void setGalleryImages(List<String> galleryImages) {
        this.galleryImages = galleryImages != null ? galleryImages : new ArrayList<>();
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Boolean getGenerateEn() {
        return generateEn;
    }
    
    public void setGenerateEn(Boolean generateEn) {
        this.generateEn = generateEn;
    }
}
