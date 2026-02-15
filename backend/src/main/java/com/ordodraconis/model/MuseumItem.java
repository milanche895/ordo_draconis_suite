package com.ordodraconis.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "museum")
public class MuseumItem {
    @Id
    private String id;
    
    private MultiLanguageContent title;
    private MultiLanguageContent description;
    private MultiLanguageContent content;
    
    @Indexed(unique = true)
    private String slug;
    
    private String coverImage;
    private List<String> galleryImages = new ArrayList<>();
    
    private String category; // e.g., "Weapons", "Armor", "Artifacts", "Documents"
    private String period; // e.g., "12th century", "Medieval"
    private String origin; // e.g., "Serbia", "Byzantine Empire"
    
    private boolean featured = false;
    private boolean active = true;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public MuseumItem() {
    }
    
    public MuseumItem(String id, MultiLanguageContent title, MultiLanguageContent description,
                     MultiLanguageContent content, String slug, String coverImage,
                     List<String> galleryImages, String category, String period, String origin,
                     boolean featured, boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.slug = slug;
        this.coverImage = coverImage;
        this.galleryImages = galleryImages != null ? galleryImages : new ArrayList<>();
        this.category = category;
        this.period = period;
        this.origin = origin;
        this.featured = featured;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getPeriod() {
        return period;
    }
    
    public void setPeriod(String period) {
        this.period = period;
    }
    
    public String getOrigin() {
        return origin;
    }
    
    public void setOrigin(String origin) {
        this.origin = origin;
    }
    
    public boolean isFeatured() {
        return featured;
    }
    
    public void setFeatured(boolean featured) {
        this.featured = featured;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
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
