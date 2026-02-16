package com.ordodraconis.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "festivals")
public class Festival {
    @Id
    private String id;
    
    private int year;
    
    private MultiLanguageContent title;
    private MultiLanguageContent description;
    private MultiLanguageContent content;
    
    @Indexed(unique = true)
    private String slug;
    
    private String coverImage;
    private List<String> galleryImages = new ArrayList<>();
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Festival() {
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public int getYear() {
        return year;
    }
    
    public void setYear(int year) {
        this.year = year;
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
}
