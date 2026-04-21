package com.ordodraconis.dto;

import java.util.ArrayList;
import java.util.List;

public class GalleryCustomAlbumRequest {
    private String titleSrCyrl;
    private String titleSrLatn;
    private String titleEn;
    private List<String> images = new ArrayList<>();

    public String getTitleSrCyrl() {
        return titleSrCyrl;
    }

    public void setTitleSrCyrl(String titleSrCyrl) {
        this.titleSrCyrl = titleSrCyrl;
    }

    public String getTitleSrLatn() {
        return titleSrLatn;
    }

    public void setTitleSrLatn(String titleSrLatn) {
        this.titleSrLatn = titleSrLatn;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images != null ? images : new ArrayList<>();
    }
}