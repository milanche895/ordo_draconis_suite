package com.ordodraconis.dto;

import java.util.ArrayList;
import java.util.List;

public class GalleryAdminAlbumDto {
    private String id;
    private String key;
    private String type;
    private String title;
    private LocalizedStringsDto titleLocales;
    private List<String> images = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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
}