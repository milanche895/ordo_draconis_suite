package com.ordodraconis.repository;

import com.ordodraconis.model.MuseumItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MuseumItemRepository extends MongoRepository<MuseumItem, String> {
    Optional<MuseumItem> findBySlug(String slug);
    List<MuseumItem> findByActiveTrue();
    List<MuseumItem> findByFeaturedTrue();
}
