package com.ordodraconis.dto;

import java.time.LocalDateTime;
import java.util.List;

public class FestivalDto {
    private String id;
    private int year;
    private String title;
    private String description;
    private String content;
    private String slug;
    private String coverImage;
    private List<String> galleryImages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private final FestivalDto dto = new FestivalDto();
        
        public Builder id(String id) {
            dto.id = id;
            return this;
        }
        
        public Builder year(int year) {
            dto.year = year;
            return this;
        }
        
        public Builder title(String title) {
            dto.title = title;
            return this;
        }
        
        public Builder description(String description) {
            dto.description = description;
            return this;
        }
        
        public Builder content(String content) {
            dto.content = content;
            return this;
        }
        
        public Builder slug(String slug) {
            dto.slug = slug;
            return this;
        }
        
        public Builder coverImage(String coverImage) {
            dto.coverImage = coverImage;
            return this;
        }
        
        public Builder galleryImages(List<String> galleryImages) {
            dto.galleryImages = galleryImages;
            return this;
        }
        
        public Builder createdAt(LocalDateTime createdAt) {
            dto.createdAt = createdAt;
            return this;
        }
        
        public Builder updatedAt(LocalDateTime updatedAt) {
            dto.updatedAt = updatedAt;
            return this;
        }
        
        public FestivalDto build() {
            return dto;
        }
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    
    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    
    public List<String> getGalleryImages() { return galleryImages; }
    public void setGalleryImages(List<String> galleryImages) { this.galleryImages = galleryImages; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
