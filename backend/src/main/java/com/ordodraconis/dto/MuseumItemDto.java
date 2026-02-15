package com.ordodraconis.dto;

import java.time.LocalDateTime;

public class MuseumItemDto {
    private String id;
    private String title;
    private String description;
    private String content;
    private String slug;
    private String coverImage;
    private String category;
    private String period;
    private String origin;
    private boolean featured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MuseumItemDto() {
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class Builder {
        private final MuseumItemDto dto = new MuseumItemDto();
        public Builder id(String id) { dto.setId(id); return this; }
        public Builder title(String title) { dto.setTitle(title); return this; }
        public Builder description(String description) { dto.setDescription(description); return this; }
        public Builder content(String content) { dto.setContent(content); return this; }
        public Builder slug(String slug) { dto.setSlug(slug); return this; }
        public Builder coverImage(String coverImage) { dto.setCoverImage(coverImage); return this; }
        public Builder category(String category) { dto.setCategory(category); return this; }
        public Builder period(String period) { dto.setPeriod(period); return this; }
        public Builder origin(String origin) { dto.setOrigin(origin); return this; }
        public Builder featured(boolean featured) { dto.setFeatured(featured); return this; }
        public Builder createdAt(LocalDateTime createdAt) { dto.setCreatedAt(createdAt); return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { dto.setUpdatedAt(updatedAt); return this; }
        public MuseumItemDto build() { return dto; }
    }
}
