package com.ordodraconis.dto;

import java.util.ArrayList;
import java.util.List;

public class KrcmaPageAdminDto {
    private LocalizedStringsDto description;
    private List<String> galleryImages = new ArrayList<>();
    private String menuPdfUrl;

    public LocalizedStringsDto getDescription() {
        return description;
    }

    public void setDescription(LocalizedStringsDto description) {
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
