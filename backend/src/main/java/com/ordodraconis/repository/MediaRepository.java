package com.ordodraconis.repository;

import com.ordodraconis.model.Media;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MediaRepository extends MongoRepository<Media, String> {
    List<Media> findByDeletedFalse();
}
