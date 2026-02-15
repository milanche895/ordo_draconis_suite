package com.ordodraconis.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    
    private MultiLanguageContent name;
    private MultiLanguageContent description;
    
    @Indexed(unique = true)
    private String slug;
    
    private BigDecimal price;
    private String currency; // RSD, EUR, USD
    
    private List<String> images = new ArrayList<>();
    
    private boolean active = true;
    private Integer stock; // null = unlimited
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Product() {
    }
    
    public Product(String id, MultiLanguageContent name, MultiLanguageContent description, 
                  String slug, BigDecimal price, String currency, List<String> images, 
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
    
    public MultiLanguageContent getName() {
        return name;
    }
    
    public void setName(MultiLanguageContent name) {
        this.name = name;
    }
    
    public MultiLanguageContent getDescription() {
        return description;
    }
    
    public void setDescription(MultiLanguageContent description) {
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
        private MultiLanguageContent name;
        private MultiLanguageContent description;
        private String slug;
        private BigDecimal price;
        private String currency;
        private List<String> images = new ArrayList<>();
        private boolean active = true;
        private Integer stock;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public Builder id(String id) {
            this.id = id;
            return this;
        }
        
        public Builder name(MultiLanguageContent name) {
            this.name = name;
            return this;
        }
        
        public Builder description(MultiLanguageContent description) {
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
        
        public Product build() {
            return new Product(id, name, description, slug, price, currency, images, 
                             active, stock, createdAt, updatedAt);
        }
    }
}
