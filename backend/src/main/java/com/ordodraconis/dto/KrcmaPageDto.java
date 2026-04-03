package com.ordodraconis.dto;

import java.util.List;

public class KrcmaPageDto {
    private String description;
    private List<String> galleryImages;
    private String menuPdfUrl;

    public KrcmaPageDto() {
    }

    public KrcmaPageDto(String description, List<String> galleryImages, String menuPdfUrl) {
        this.description = description;
        this.galleryImages = galleryImages;
        this.menuPdfUrl = menuPdfUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getGalleryImages() {
        return galleryImages;
    }

    public void setGalleryImages(List<String> galleryImages) {
        this.galleryImages = galleryImages;
    }

    public String getMenuPdfUrl() {
        return menuPdfUrl;
    }

    public void setMenuPdfUrl(String menuPdfUrl) {
        this.menuPdfUrl = menuPdfUrl;
    }
}
