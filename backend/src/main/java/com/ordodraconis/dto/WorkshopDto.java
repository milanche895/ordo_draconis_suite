package com.ordodraconis.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class WorkshopDto {
    private String id;
    private String title;
    private String description;
    private String content;
    /** All locales for admin forms; public clients may ignore. */
    private LocalizedStringsDto titleLocales;
    private LocalizedStringsDto descriptionLocales;
    private LocalizedStringsDto contentLocales;
    private String slug;
    private String coverImage;
    private List<String> galleryImages;
    private Integer duration;
    private Integer maxParticipants;
    private BigDecimal price;
    private String currency;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public WorkshopDto() {
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
    public LocalizedStringsDto getTitleLocales() { return titleLocales; }
    public void setTitleLocales(LocalizedStringsDto titleLocales) { this.titleLocales = titleLocales; }
    public LocalizedStringsDto getDescriptionLocales() { return descriptionLocales; }
    public void setDescriptionLocales(LocalizedStringsDto descriptionLocales) { this.descriptionLocales = descriptionLocales; }
    public LocalizedStringsDto getContentLocales() { return contentLocales; }
    public void setContentLocales(LocalizedStringsDto contentLocales) { this.contentLocales = contentLocales; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    public List<String> getGalleryImages() { return galleryImages; }
    public void setGalleryImages(List<String> galleryImages) { this.galleryImages = galleryImages; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class Builder {
        private final WorkshopDto dto = new WorkshopDto();
        public Builder id(String id) { dto.setId(id); return this; }
        public Builder title(String title) { dto.setTitle(title); return this; }
        public Builder description(String description) { dto.setDescription(description); return this; }
        public Builder content(String content) { dto.setContent(content); return this; }
        public Builder titleLocales(LocalizedStringsDto v) { dto.setTitleLocales(v); return this; }
        public Builder descriptionLocales(LocalizedStringsDto v) { dto.setDescriptionLocales(v); return this; }
        public Builder contentLocales(LocalizedStringsDto v) { dto.setContentLocales(v); return this; }
        public Builder slug(String slug) { dto.setSlug(slug); return this; }
        public Builder coverImage(String coverImage) { dto.setCoverImage(coverImage); return this; }
        public Builder galleryImages(List<String> galleryImages) { dto.setGalleryImages(galleryImages); return this; }
        public Builder duration(Integer duration) { dto.setDuration(duration); return this; }
        public Builder maxParticipants(Integer maxParticipants) { dto.setMaxParticipants(maxParticipants); return this; }
        public Builder price(BigDecimal price) { dto.setPrice(price); return this; }
        public Builder currency(String currency) { dto.setCurrency(currency); return this; }
        public Builder active(boolean active) { dto.setActive(active); return this; }
        public Builder createdAt(LocalDateTime createdAt) { dto.setCreatedAt(createdAt); return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { dto.setUpdatedAt(updatedAt); return this; }
        public WorkshopDto build() { return dto; }
    }
}
