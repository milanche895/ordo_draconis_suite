package com.ordodraconis.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProductDto {
    private String id;
    private String name;
    private String description;
    private String slug;
    private BigDecimal price;
    private String currency;
    private List<String> images = new ArrayList<>();
    private boolean active;
    private Integer stock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public ProductDto() {
    }
    
    public ProductDto(String id, String name, String description, String slug, 
                     BigDecimal price, String currency, List<String> images, 
                     boolean active, Integer stock, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.slug = slug;
        this.price = price;
        this.currency = currency;
        this.images = images != null ? images : new ArrayList<>();
        this.active = active;
        this.stock = stock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getSlug() {
        return slug;
    }
    
    public void setSlug(String slug) {
        this.slug = slug;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public static class Builder {
        private String id;
        private String name;
        private String description;
        private String slug;
        private BigDecimal price;
        private String currency;
        private List<String> images = new ArrayList<>();
        private boolean active;
        private Integer stock;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public Builder id(String id) {
            this.id = id;
            return this;
        }
        
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder description(String description) {
            this.description = description;
            return this;
        }
        
        public Builder slug(String slug) {
            this.slug = slug;
            return this;
        }
        
        public Builder price(BigDecimal price) {
            this.price = price;
            return this;
        }
        
        public Builder currency(String currency) {
            this.currency = currency;
            return this;
        }
        
        public Builder images(List<String> images) {
            this.images = images;
            return this;
        }
        
        public Builder active(boolean active) {
            this.active = active;
            return this;
        }
        
        public Builder stock(Integer stock) {
            this.stock = stock;
            return this;
        }
        
        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public ProductDto build() {
            return new ProductDto(id, name, description, slug, price, currency, images, 
                                active, stock, createdAt, updatedAt);
        }
    }
}
