package com.ordodraconis.controller;

import com.ordodraconis.dto.AlbumDto;
import com.ordodraconis.dto.ContactRequest;
import com.ordodraconis.dto.NewsDto;
import com.ordodraconis.dto.ProductDto;
import com.ordodraconis.service.AlbumService;
import com.ordodraconis.service.NewsService;
import com.ordodraconis.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    
    private final NewsService newsService;
    private final ProductService productService;
    private final AlbumService albumService;
    
    public PublicController(NewsService newsService, ProductService productService, AlbumService albumService) {
        this.newsService = newsService;
        this.productService = productService;
        this.albumService = albumService;
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
    
    @PostMapping("/contact")
    public ResponseEntity<Void> contact(@Valid @RequestBody ContactRequest request) {
        // TODO: Send email or save to database
        return ResponseEntity.ok().build();
    }
}
