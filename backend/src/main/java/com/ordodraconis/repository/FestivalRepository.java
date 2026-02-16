package com.ordodraconis.repository;

import com.ordodraconis.model.Festival;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FestivalRepository extends MongoRepository<Festival, String> {
    Optional<Festival> findByYear(int year);
    Optional<Festival> findBySlug(String slug);
    List<Festival> findAllByOrderByYearDesc();
}
