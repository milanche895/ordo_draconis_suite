package com.ordodraconis.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class FestivalCreateUpdateDto {
    @Min(2000)
    @Max(2100)
    private int year;
    
    @NotBlank
    private String titleSrCyrl;
    private String titleSrLatn;
    private String titleEn;
    
    @NotBlank
    private String descriptionSrCyrl;
    private String descriptionSrLatn;
    private String descriptionEn;
    
    private String contentSrCyrl;
    private String contentSrLatn;
    private String contentEn;
    
    private String coverImage;
    
    @Size(max = 15, message = "Galerija može imati najviše 15 slika (preporučeno 10-15)")
    private List<String> galleryImages = new ArrayList<>();
    
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    
    public String getTitleSrCyrl() { return titleSrCyrl; }
    public void setTitleSrCyrl(String titleSrCyrl) { this.titleSrCyrl = titleSrCyrl; }
    
    public String getTitleSrLatn() { return titleSrLatn; }
    public void setTitleSrLatn(String titleSrLatn) { this.titleSrLatn = titleSrLatn; }
    
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    
    public String getDescriptionSrCyrl() { return descriptionSrCyrl; }
    public void setDescriptionSrCyrl(String descriptionSrCyrl) { this.descriptionSrCyrl = descriptionSrCyrl; }
    
    public String getDescriptionSrLatn() { return descriptionSrLatn; }
    public void setDescriptionSrLatn(String descriptionSrLatn) { this.descriptionSrLatn = descriptionSrLatn; }
    
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    
    public String getContentSrCyrl() { return contentSrCyrl; }
    public void setContentSrCyrl(String contentSrCyrl) { this.contentSrCyrl = contentSrCyrl; }
    
    public String getContentSrLatn() { return contentSrLatn; }
    public void setContentSrLatn(String contentSrLatn) { this.contentSrLatn = contentSrLatn; }
    
    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }
    
    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    
    public List<String> getGalleryImages() { return galleryImages; }
    public void setGalleryImages(List<String> galleryImages) { this.galleryImages = galleryImages; }
}
