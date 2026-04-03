package com.ordodraconis.controller;

import com.ordodraconis.dto.*;
import com.ordodraconis.model.Media;
import com.ordodraconis.service.AlbumService;
import com.ordodraconis.service.MediaService;
import com.ordodraconis.service.FestivalService;
import com.ordodraconis.service.MuseumItemService;
import com.ordodraconis.service.NewsService;
import com.ordodraconis.service.ProductService;
import com.ordodraconis.service.PageIntroService;
import com.ordodraconis.service.WorkshopService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final NewsService newsService;
    private final ProductService productService;
    private final AlbumService albumService;
    private final MediaService mediaService;
    private final MuseumItemService museumItemService;
    private final FestivalService festivalService;
    private final WorkshopService workshopService;
    private final PageIntroService pageIntroService;

    public AdminController(NewsService newsService, ProductService productService,
                          AlbumService albumService, MediaService mediaService,
                          MuseumItemService museumItemService, FestivalService festivalService,
                          WorkshopService workshopService,
                          PageIntroService pageIntroService) {
        this.newsService = newsService;
        this.productService = productService;
        this.albumService = albumService;
        this.mediaService = mediaService;
        this.museumItemService = museumItemService;
        this.festivalService = festivalService;
        this.workshopService = workshopService;
        this.pageIntroService = pageIntroService;
    }
    
    // News CRUD
    @GetMapping("/news")
    public ResponseEntity<List<NewsDto>> getAllNews() {
        return ResponseEntity.ok(newsService.getAll("sr", "cyrl"));
    }
    
    @PostMapping("/news")
    public ResponseEntity<NewsDto> createNews(@Valid @RequestBody NewsCreateUpdateDto dto) {
        return ResponseEntity.ok(newsService.create(dto));
    }
    
    @PutMapping("/news/{id}")
    public ResponseEntity<NewsDto> updateNews(@PathVariable String id, @Valid @RequestBody NewsCreateUpdateDto dto) {
        return ResponseEntity.ok(newsService.update(id, dto));
    }
    
    @DeleteMapping("/news/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable String id) {
        newsService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    // Product CRUD
    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAll("sr", "cyrl"));
    }
    
    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductCreateUpdateDto dto) {
        return ResponseEntity.ok(productService.create(dto));
    }
    
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable String id, @Valid @RequestBody ProductCreateUpdateDto dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }
    
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    // Album CRUD
    @GetMapping("/albums")
    public ResponseEntity<List<AlbumDto>> getAllAlbums() {
        return ResponseEntity.ok(albumService.getAll("sr", "cyrl"));
    }
    
    @PostMapping("/albums")
    public ResponseEntity<AlbumDto> createAlbum(@Valid @RequestBody AlbumCreateUpdateDto dto) {
        return ResponseEntity.ok(albumService.create(dto));
    }
    
    @PutMapping("/albums/{id}")
    public ResponseEntity<AlbumDto> updateAlbum(@PathVariable String id, @Valid @RequestBody AlbumCreateUpdateDto dto) {
        return ResponseEntity.ok(albumService.update(id, dto));
    }
    
    @DeleteMapping("/albums/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable String id) {
        albumService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    // Media
    @PostMapping("/media/upload")
    public ResponseEntity<Media> uploadMedia(@RequestParam("file") MultipartFile file) throws IOException {
        log.info("POST /media/upload: name={}, size={}, contentType={}, empty={}",
                file.getOriginalFilename(), file.getSize(), file.getContentType(), file.isEmpty());
        Media saved = mediaService.uploadFile(file);
        log.info("POST /media/upload: saved id={}, path={}", saved.getId(), saved.getPath());
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/media")
    public ResponseEntity<List<Media>> getAllMedia() {
        return ResponseEntity.ok(mediaService.getAll());
    }
    
    @DeleteMapping("/media/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable String id) {
        mediaService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    // Workshop CRUD
    @GetMapping("/workshops")
    public ResponseEntity<List<WorkshopDto>> getAllWorkshops() {
        return ResponseEntity.ok(workshopService.getAll("sr", "cyrl"));
    }
    
    @PostMapping("/workshops")
    public ResponseEntity<WorkshopDto> createWorkshop(@Valid @RequestBody WorkshopCreateUpdateDto dto) {
        return ResponseEntity.ok(workshopService.create(dto));
    }
    
    @PutMapping("/workshops/{id}")
    public ResponseEntity<WorkshopDto> updateWorkshop(@PathVariable String id, @Valid @RequestBody WorkshopCreateUpdateDto dto) {
        return ResponseEntity.ok(workshopService.update(id, dto));
    }
    
    @DeleteMapping("/workshops/{id}")
    public ResponseEntity<Void> deleteWorkshop(@PathVariable String id) {
        workshopService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/page-intros/workshops")
    public ResponseEntity<LocalizedStringsDto> getWorkshopsPageIntro() {
        return ResponseEntity.ok(pageIntroService.getWorkshopsIntroForAdmin());
    }

    @PutMapping("/page-intros/workshops")
    public ResponseEntity<LocalizedStringsDto> updateWorkshopsPageIntro(@RequestBody LocalizedStringsDto dto) {
        return ResponseEntity.ok(pageIntroService.updateWorkshopsIntro(dto));
    }

    @GetMapping("/page-intros/krcma")
    public ResponseEntity<KrcmaPageAdminDto> getKrcmaPageIntro() {
        return ResponseEntity.ok(pageIntroService.getKrcmaForAdmin());
    }

    @PutMapping("/page-intros/krcma")
    public ResponseEntity<KrcmaPageAdminDto> updateKrcmaPageIntro(@RequestBody KrcmaPageAdminDto dto) {
        return ResponseEntity.ok(pageIntroService.updateKrcma(dto));
    }
    
    // Museum Item CRUD
    @GetMapping("/museum")
    public ResponseEntity<List<MuseumItemDto>> getAllMuseumItems() {
        return ResponseEntity.ok(museumItemService.getAll("sr", "cyrl"));
    }
    
    @PostMapping("/museum")
    public ResponseEntity<MuseumItemDto> createMuseumItem(@Valid @RequestBody MuseumItemCreateUpdateDto dto) {
        return ResponseEntity.ok(museumItemService.create(dto));
    }
    
    @PutMapping("/museum/{id}")
    public ResponseEntity<MuseumItemDto> updateMuseumItem(@PathVariable String id, @Valid @RequestBody MuseumItemCreateUpdateDto dto) {
        return ResponseEntity.ok(museumItemService.update(id, dto));
    }
    
    @DeleteMapping("/museum/{id}")
    public ResponseEntity<Void> deleteMuseumItem(@PathVariable String id) {
        museumItemService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    // Festival CRUD
    @GetMapping("/festivals")
    public ResponseEntity<List<FestivalDto>> getAllFestivals() {
        return ResponseEntity.ok(festivalService.getAll("sr", "cyrl"));
    }
    
    @PostMapping("/festivals")
    public ResponseEntity<FestivalDto> createFestival(@Valid @RequestBody FestivalCreateUpdateDto dto) {
        return ResponseEntity.ok(festivalService.create(dto));
    }
    
    @PutMapping("/festivals/{id}")
    public ResponseEntity<FestivalDto> updateFestival(@PathVariable String id, @Valid @RequestBody FestivalCreateUpdateDto dto) {
        return ResponseEntity.ok(festivalService.update(id, dto));
    }
    
    @DeleteMapping("/festivals/{id}")
    public ResponseEntity<Void> deleteFestival(@PathVariable String id) {
        festivalService.delete(id);
        return ResponseEntity.ok().build();
    }
}
