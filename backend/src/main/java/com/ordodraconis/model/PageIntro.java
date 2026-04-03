package com.ordodraconis.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "page_intros")
public class PageIntro {

    public static final String WORKSHOPS = "workshops";
    public static final String KRCMA = "krcma";

    @Id
    private String id;

    private MultiLanguageContent description;

    /** Galerija krčme (URL слика); само за id=krcma */
    private List<String> galleryImages;

    /** URL PDF менија; само за id=krcma */
    private String menuPdfUrl;

    private LocalDateTime updatedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public MultiLanguageContent getDescription() {
        return description;
    }

    public void setDescription(MultiLanguageContent description) {
        this.description = description;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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
