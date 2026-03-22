package com.ordodraconis.repository;

import com.ordodraconis.model.PageIntro;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PageIntroRepository extends MongoRepository<PageIntro, String> {
}
