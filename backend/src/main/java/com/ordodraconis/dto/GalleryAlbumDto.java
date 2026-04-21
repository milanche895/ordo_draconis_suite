package com.ordodraconis.dto;

import java.util.ArrayList;
import java.util.List;

public class GalleryAlbumDto {
    private String id;
    private String title;
    private String description;
    private LocalizedStringsDto titleLocales;
    private List<String> images = new ArrayList<>();

    public GalleryAlbumDto() {
    }

    public static Builder builder() {
        return new Builder();
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalizedStringsDto getTitleLocales() {
        return titleLocales;
    }

    public void setTitleLocales(LocalizedStringsDto titleLocales) {
        this.titleLocales = titleLocales;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images != null ? images : new ArrayList<>();
    }

    public static class Builder {
        private final GalleryAlbumDto dto = new GalleryAlbumDto();

        public Builder id(String id) {
            dto.setId(id);
            return this;
        }

        public Builder title(String title) {
            dto.setTitle(title);
            return this;
        }

        public Builder description(String description) {
            dto.setDescription(description);
            return this;
        }

        public Builder titleLocales(LocalizedStringsDto titleLocales) {
            dto.setTitleLocales(titleLocales);
            return this;
        }

        public Builder images(List<String> images) {
            dto.setImages(images);
            return this;
        }

        public GalleryAlbumDto build() {
            return dto;
        }
    }
}