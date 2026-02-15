package com.ordodraconis.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "workshops")
public class Workshop {
    @Id
    private String id;
    
    private MultiLanguageContent title;
    private MultiLanguageContent description;
    private MultiLanguageContent content;
    
    @Indexed(unique = true)
    private String slug;
    
    private String coverImage;
    private List<String> galleryImages = new ArrayList<>();
    
    private Integer duration; // in minutes
    private Integer maxParticipants;
    private BigDecimal price; // null = free
    private String currency;
    
    private boolean active = true;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Workshop() {
    }
    
    public Workshop(String id, MultiLanguageContent title, MultiLanguageContent description,
                   MultiLanguageContent content, String slug, String coverImage,
                   List<String> galleryImages, Integer duration, Integer maxParticipants,
                   BigDecimal price, String currency, boolean active,
                   LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.slug = slug;
        this.coverImage = coverImage;
        this.galleryImages = galleryImages != null ? galleryImages : new ArrayList<>();
        this.duration = duration;
        this.maxParticipants = maxParticipants;
        this.price = price;
        this.currency = currency;
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
    
    public Integer getDuration() {
        return duration;
    }
    
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    
    public Integer getMaxParticipants() {
        return maxParticipants;
    }
    
    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
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
