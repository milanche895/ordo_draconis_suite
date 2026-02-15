package com.ordodraconis.repository;

import com.ordodraconis.model.Workshop;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WorkshopRepository extends MongoRepository<Workshop, String> {
    Optional<Workshop> findBySlug(String slug);
    List<Workshop> findByActiveTrue();
}
