package com.ordodraconis.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "media")
public class Media {
    @Id
    private String id;
    
    private String filename;
    private String originalFilename;
    private String contentType;
    private Long size;
    private String path; // Relative path from upload dir

    /** Cloudinary {@code resource_type} ({@code image}, {@code raw}, {@code video}) — for delete API. */
    private String cloudinaryResourceType;

    private String altText;
    private List<String> tags = new ArrayList<>();
    
    private boolean deleted = false;
    private LocalDateTime createdAt;
    
    public Media() {
    }
    
    public Media(String id, String filename, String originalFilename, String contentType, 
                Long size, String path, String altText, List<String> tags, 
                boolean deleted, LocalDateTime createdAt) {
        this.id = id;
        this.filename = filename;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.size = size;
        this.path = path;
        this.altText = altText;
        this.tags = tags != null ? tags : new ArrayList<>();
        this.deleted = deleted;
        this.createdAt = createdAt;
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
    
    public String getFilename() {
        return filename;
    }
    
    public void setFilename(String filename) {
        this.filename = filename;
    }
    
    public String getOriginalFilename() {
        return originalFilename;
    }
    
    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public Long getSize() {
        return size;
    }
    
    public void setSize(Long size) {
        this.size = size;
    }
    
    public String getPath() {
        return path;
    }
    
    public void setPath(String path) {
        this.path = path;
    }

    public String getCloudinaryResourceType() {
        return cloudinaryResourceType;
    }

    public void setCloudinaryResourceType(String cloudinaryResourceType) {
        this.cloudinaryResourceType = cloudinaryResourceType;
    }

    public String getAltText() {
        return altText;
    }
    
    public void setAltText(String altText) {
        this.altText = altText;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags != null ? tags : new ArrayList<>();
    }
    
    public boolean isDeleted() {
        return deleted;
    }
    
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public static class Builder {
        private String id;
        private String filename;
        private String originalFilename;
        private String contentType;
        private Long size;
        private String path;
        private String altText;
        private List<String> tags = new ArrayList<>();
        private boolean deleted = false;
        private LocalDateTime createdAt;
        
        public Builder id(String id) {
            this.id = id;
            return this;
        }
        
        public Builder filename(String filename) {
            this.filename = filename;
            return this;
        }
        
        public Builder originalFilename(String originalFilename) {
            this.originalFilename = originalFilename;
            return this;
        }
        
        public Builder contentType(String contentType) {
            this.contentType = contentType;
            return this;
        }
        
        public Builder size(Long size) {
            this.size = size;
            return this;
        }
        
        public Builder path(String path) {
            this.path = path;
            return this;
        }
        
        public Builder altText(String altText) {
            this.altText = altText;
            return this;
        }
        
        public Builder tags(List<String> tags) {
            this.tags = tags;
            return this;
        }
        
        public Builder deleted(boolean deleted) {
            this.deleted = deleted;
            return this;
        }
        
        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public Media build() {
            return new Media(id, filename, originalFilename, contentType, size, path, 
                           altText, tags, deleted, createdAt);
        }
    }
}
