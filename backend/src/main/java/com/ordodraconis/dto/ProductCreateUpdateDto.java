package com.ordodraconis.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductCreateUpdateDto {
    @NotBlank
    private String nameSrCyrl;
    private String nameSrLatn;
    private String nameEn;
    
    @NotBlank
    private String descriptionSrCyrl;
    private String descriptionSrLatn;
    private String descriptionEn;
    
    @NotNull
    @Positive
    private BigDecimal price;
    
    @NotBlank
    private String currency;
    
    private List<String> images = new ArrayList<>();
    private boolean active = true;
    private Integer stock;
    private Boolean generateEn = false;
    
    // Getters and Setters
    public String getNameSrCyrl() {
        return nameSrCyrl;
    }
    
    public void setNameSrCyrl(String nameSrCyrl) {
        this.nameSrCyrl = nameSrCyrl;
    }
    
    public String getNameSrLatn() {
        return nameSrLatn;
    }
    
    public void setNameSrLatn(String nameSrLatn) {
        this.nameSrLatn = nameSrLatn;
    }
    
    public String getNameEn() {
        return nameEn;
    }
    
    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }
    
    public String getDescriptionSrCyrl() {
        return descriptionSrCyrl;
    }
    
    public void setDescriptionSrCyrl(String descriptionSrCyrl) {
        this.descriptionSrCyrl = descriptionSrCyrl;
    }
    
    public String getDescriptionSrLatn() {
        return descriptionSrLatn;
    }
    
    public void setDescriptionSrLatn(String descriptionSrLatn) {
        this.descriptionSrLatn = descriptionSrLatn;
    }
    
    public String getDescriptionEn() {
        return descriptionEn;
    }
    
    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
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
    
    public List<String> getImages() {
        return images;
    }
    
    public void setImages(List<String> images) {
        this.images = images != null ? images : new ArrayList<>();
    }
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    public Boolean getGenerateEn() {
        return generateEn;
    }
    
    public void setGenerateEn(Boolean generateEn) {
        this.generateEn = generateEn;
    }
}
