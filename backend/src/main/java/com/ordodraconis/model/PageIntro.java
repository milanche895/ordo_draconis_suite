package com.ordodraconis.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "page_intros")
public class PageIntro {

    public static final String WORKSHOPS = "workshops";

    @Id
    private String id;

    private MultiLanguageContent description;

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
}
