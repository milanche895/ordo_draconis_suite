package com.ordodraconis.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "news")
public class News {
    @Id
    private String id;
    
    private MultiLanguageContent title;
    private MultiLanguageContent summary;
    private MultiLanguageContent content; // Markdown
    
    @Indexed(unique = true)
    private String slug;
    
    private String coverImage;
    private List<String> galleryImages = new ArrayList<>();
    
    private String status; // DRAFT, PUBLISHED
    
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public News() {
    }
    
    public News(String id, MultiLanguageContent title, MultiLanguageContent summary, 
                MultiLanguageContent content, String slug, String coverImage, 
                List<String> galleryImages, String status, LocalDateTime publishedAt, 
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.slug = slug;
        this.coverImage = coverImage;
        this.galleryImages = galleryImages != null ? galleryImages : new ArrayList<>();
        this.status = status;
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
    
    public MultiLanguageContent getTitle() {
        return title;
    }
    
    public void setTitle(MultiLanguageContent title) {
        this.title = title;
    }
    
    public MultiLanguageContent getSummary() {
        return summary;
    }
    
    public void setSummary(MultiLanguageContent summary) {
        this.summary = summary;
    }
    
    public MultiLanguageContent getContent() {
        return content;
    }
    
    public void setContent(MultiLanguageContent content) {
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
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
        private MultiLanguageContent title;
        private MultiLanguageContent summary;
        private MultiLanguageContent content;
        private String slug;
        private String coverImage;
        private List<String> galleryImages = new ArrayList<>();
        private String status;
        private LocalDateTime publishedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public Builder id(String id) {
            this.id = id;
            return this;
        }
        
        public Builder title(MultiLanguageContent title) {
            this.title = title;
            return this;
        }
        
        public Builder summary(MultiLanguageContent summary) {
            this.summary = summary;
            return this;
        }
        
        public Builder content(MultiLanguageContent content) {
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
        
        public Builder status(String status) {
            this.status = status;
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
        
        public News build() {
            return new News(id, title, summary, content, slug, coverImage, 
                          galleryImages, status, publishedAt, createdAt, updatedAt);
        }
    }
}
