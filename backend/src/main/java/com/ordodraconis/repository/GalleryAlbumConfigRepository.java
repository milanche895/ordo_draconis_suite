package com.ordodraconis.repository;

import com.ordodraconis.model.GalleryAlbumConfig;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface GalleryAlbumConfigRepository extends MongoRepository<GalleryAlbumConfig, String> {
    List<GalleryAlbumConfig> findByCustom(boolean custom);
    Optional<GalleryAlbumConfig> findByCustomFalseAndKey(String key);
}