package com.ordodraconis.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class NewsDto {
    private String id;
    private String title;
    private String summary;
    private String content;
    private String slug;
    private String coverImage;
    private List<String> galleryImages = new ArrayList<>();
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public NewsDto() {
    }
    
    public NewsDto(String id, String title, String summary, String content, String slug, 
                   String coverImage, List<String> galleryImages,
                   LocalDateTime publishedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.slug = slug;
        this.coverImage = coverImage;
        this.galleryImages = galleryImages != null ? galleryImages : new ArrayList<>();
        this.publishedAt = publishedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getSummary() {
        return summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getSlug() {
        return slug;
    }
    
    public void setSlug(String slug) {
        this.slug = slug;
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
    
    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }
    
    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public static class Builder {
        private String id;
        private String title;
        private String summary;
        private String content;
        private String slug;
        private String coverImage;
        private List<String> galleryImages = new ArrayList<>();
        private LocalDateTime publishedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public Builder id(String id) {
            this.id = id;
            return this;
        }
        
        public Builder title(String title) {
            this.title = title;
            return this;
        }
        
        public Builder summary(String summary) {
            this.summary = summary;
            return this;
        }
        
        public Builder content(String content) {
            this.content = content;
            return this;
        }
        
        public Builder slug(String slug) {
            this.slug = slug;
            return this;
        }
        
        public Builder coverImage(String coverImage) {
            this.coverImage = coverImage;
            return this;
        }
        
        public Builder galleryImages(List<String> galleryImages) {
            this.galleryImages = galleryImages;
            return this;
        }
        
        public Builder publishedAt(LocalDateTime publishedAt) {
            this.publishedAt = publishedAt;
            return this;
        }
        
        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public NewsDto build() {
            return new NewsDto(id, title, summary, content, slug, coverImage, galleryImages, 
                             publishedAt, createdAt, updatedAt);
        }
    }
}
