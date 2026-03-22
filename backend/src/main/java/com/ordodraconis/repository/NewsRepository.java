package com.ordodraconis.repository;

import com.ordodraconis.model.News;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface NewsRepository extends MongoRepository<News, String> {
    Optional<News> findBySlug(String slug);
}
