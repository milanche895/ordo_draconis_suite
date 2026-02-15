package com.ordodraconis.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "albums")
public class Album {
    @Id
    private String id;
    
    private MultiLanguageContent title;
    private MultiLanguageContent description;
    
    private List<String> images = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    
    private LocalDateTime eventDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Album() {
    }
    
    public Album(String id, MultiLanguageContent title, MultiLanguageContent description, 
                List<String> images, List<String> tags, LocalDateTime eventDate, 
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.images = images != null ? images : new ArrayList<>();
        this.tags = tags != null ? tags : new ArrayList<>();
        this.eventDate = eventDate;
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
    
    public MultiLanguageContent getDescription() {
        return description;
    }
    
    public void setDescription(MultiLanguageContent description) {
        this.description = description;
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
        private MultiLanguageContent description;
        private List<String> images = new ArrayList<>();
        private List<String> tags = new ArrayList<>();
        private LocalDateTime eventDate;
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
        
        public Builder description(MultiLanguageContent description) {
            this.description = description;
            return this;
        }
        
        public Builder images(List<String> images) {
            this.images = images;
            return this;
        }
        
        public Builder tags(List<String> tags) {
            this.tags = tags;
            return this;
        }
        
        public Builder eventDate(LocalDateTime eventDate) {
            this.eventDate = eventDate;
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
        
        public Album build() {
            return new Album(id, title, description, images, tags, eventDate, createdAt, updatedAt);
        }
    }
}
