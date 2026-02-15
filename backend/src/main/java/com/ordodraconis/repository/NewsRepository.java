package com.ordodraconis.repository;

import com.ordodraconis.model.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface NewsRepository extends MongoRepository<News, String> {
    Optional<News> findBySlug(String slug);
    Page<News> findByStatus(String status, Pageable pageable);
}
