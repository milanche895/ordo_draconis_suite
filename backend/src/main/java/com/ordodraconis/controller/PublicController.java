package com.ordodraconis.controller;

import com.ordodraconis.dto.AlbumDto;
import com.ordodraconis.dto.ContactRequest;
import com.ordodraconis.dto.FestivalDto;
import com.ordodraconis.dto.MuseumItemDto;
import com.ordodraconis.dto.NewsDto;
import com.ordodraconis.dto.ProductDto;
import com.ordodraconis.dto.PageIntroTextDto;
import com.ordodraconis.dto.WorkshopDto;
import com.ordodraconis.service.AlbumService;
import com.ordodraconis.service.PageIntroService;
import com.ordodraconis.service.FestivalService;
import com.ordodraconis.service.MuseumItemService;
import com.ordodraconis.service.NewsService;
import com.ordodraconis.service.ProductService;
import com.ordodraconis.service.WorkshopService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    
    private final NewsService newsService;
    private final ProductService productService;
    private final AlbumService albumService;
    private final MuseumItemService museumItemService;
    private final FestivalService festivalService;
    private final WorkshopService workshopService;
    private final PageIntroService pageIntroService;
    private final MongoTemplate mongoTemplate;

    public PublicController(NewsService newsService, ProductService productService,
                             AlbumService albumService, MuseumItemService museumItemService,
                             FestivalService festivalService, WorkshopService workshopService,
                             PageIntroService pageIntroService,
                             MongoTemplate mongoTemplate) {
        this.newsService = newsService;
        this.productService = productService;
        this.albumService = albumService;
        this.museumItemService = museumItemService;
        this.festivalService = festivalService;
        this.workshopService = workshopService;
        this.pageIntroService = pageIntroService;
        this.mongoTemplate = mongoTemplate;
    }
    
    @GetMapping("/news")
    public ResponseEntity<Page<NewsDto>> getNews(
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NewsDto> news = newsService.getPublishedNews(pageable, lang, script);
        return ResponseEntity.ok(news);
    }
    
    @GetMapping("/news/{slug}")
    public ResponseEntity<NewsDto> getNewsBySlug(
            @PathVariable String slug,
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        Optional<NewsDto> news = newsService.getBySlug(slug, lang, script);
        return news.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getProducts(
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        return ResponseEntity.ok(productService.getActiveProducts(lang, script));
    }
    
    @GetMapping("/products/{slug}")
    public ResponseEntity<ProductDto> getProductBySlug(
            @PathVariable String slug,
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        Optional<ProductDto> product = productService.getBySlug(slug, lang, script);
        return product.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/albums")
    public ResponseEntity<List<AlbumDto>> getAlbums(
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        return ResponseEntity.ok(albumService.getAll(lang, script));
    }
    
    @GetMapping("/albums/{id}")
    public ResponseEntity<AlbumDto> getAlbumById(
            @PathVariable String id,
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        Optional<AlbumDto> album = albumService.getById(id, lang, script);
        return album.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/festivals")
    public ResponseEntity<List<FestivalDto>> getFestivals(
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        return ResponseEntity.ok(festivalService.getAll(lang, script));
    }
    
    @GetMapping("/festivals/{year}")
    public ResponseEntity<FestivalDto> getFestivalByYear(
            @PathVariable int year,
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        Optional<FestivalDto> festival = festivalService.getByYear(year, lang, script);
        return festival.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/museum")
    public ResponseEntity<List<MuseumItemDto>> getMuseumItems(
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        return ResponseEntity.ok(museumItemService.getActive(lang, script));
    }

    @GetMapping("/workshops")
    public ResponseEntity<List<WorkshopDto>> getWorkshops(
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        return ResponseEntity.ok(workshopService.getActive(lang, script));
    }

    @GetMapping("/page-intros/workshops")
    public ResponseEntity<PageIntroTextDto> getWorkshopsPageIntro(
            @RequestParam(defaultValue = "sr") String lang,
            @RequestParam(defaultValue = "cyrl") String script
    ) {
        return ResponseEntity.ok(pageIntroService.getWorkshopsIntro(lang, script));
    }

    /** Provera konekcije: otvori http://localhost:8080/api/public/mongo-info i uporedi "database" sa bazom u Atlasu */
    @GetMapping("/mongo-info")
    public ResponseEntity<Map<String, Object>> mongoInfo() {
        String dbName = mongoTemplate.getDb().getName();
        long museumCount = museumItemService.count();
        Map<String, Object> out = new HashMap<>();
        out.put("database", dbName);
        out.put("museum_count", museumCount);
        out.put("collection", "museum");
        return ResponseEntity.ok(out);
    }

    @PostMapping("/contact")
    public ResponseEntity<Void> contact(@Valid @RequestBody ContactRequest request) {
        // TODO: Send email or save to database
        return ResponseEntity.ok().build();
    }
}
