package com.ordodraconis.service;

import com.ordodraconis.dto.ProductCreateUpdateDto;
import com.ordodraconis.dto.ProductDto;
import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.model.Product;
import com.ordodraconis.repository.ProductRepository;
import com.ordodraconis.util.SlugUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    private final TransliterationService transliterationService;
    private final TranslationService translationService;
    private final SlugUtil slugUtil;
    
    public ProductService(ProductRepository productRepository, TransliterationService transliterationService,
                         TranslationService translationService, SlugUtil slugUtil) {
        this.productRepository = productRepository;
        this.transliterationService = transliterationService;
        this.translationService = translationService;
        this.slugUtil = slugUtil;
    }
    
    public List<ProductDto> getActiveProducts(String lang, String script) {
        return productRepository.findByActiveTrue().stream()
                .map(p -> toDto(p, lang, script))
                .collect(Collectors.toList());
    }
    
    public Optional<ProductDto> getBySlug(String slug, String lang, String script) {
        return productRepository.findBySlug(slug)
                .map(p -> toDto(p, lang, script));
    }
    
    public List<ProductDto> getAll(String lang, String script) {
        return productRepository.findAll().stream()
                .map(p -> toDto(p, lang, script))
                .collect(Collectors.toList());
    }
    
    public ProductDto create(ProductCreateUpdateDto dto) {
        Product product = new Product();
        updateProductFromDto(product, dto);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product = productRepository.save(product);
        return toDto(product, "sr", "cyrl");
    }
    
    public ProductDto update(String id, ProductCreateUpdateDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        updateProductFromDto(product, dto);
        product.setUpdatedAt(LocalDateTime.now());
        product = productRepository.save(product);
        return toDto(product, "sr", "cyrl");
    }
    
    public void delete(String id) {
        productRepository.deleteById(id);
    }
    
    @Transactional
    private void updateProductFromDto(Product product, ProductCreateUpdateDto dto) {
        MultiLanguageContent name = new MultiLanguageContent();
        name.setSrCyrl(dto.getNameSrCyrl());
        name.setSrLatn(dto.getNameSrLatn() != null ? dto.getNameSrLatn() : 
                transliterationService.transliterate(dto.getNameSrCyrl()));
        
        if (dto.getGenerateEn()) {
            name.setEn(dto.getNameEn() != null ? dto.getNameEn() : 
                    translationService.translate(dto.getNameSrCyrl(), "sr", "en"));
        } else if (dto.getNameEn() != null) {
            name.setEn(dto.getNameEn());
        }
        product.setName(name);
        
        MultiLanguageContent description = new MultiLanguageContent();
        description.setSrCyrl(dto.getDescriptionSrCyrl());
        description.setSrLatn(dto.getDescriptionSrLatn() != null ? dto.getDescriptionSrLatn() : 
                transliterationService.transliterate(dto.getDescriptionSrCyrl()));
        
        if (dto.getGenerateEn()) {
            description.setEn(dto.getDescriptionEn() != null ? dto.getDescriptionEn() : 
                    translationService.translate(dto.getDescriptionSrCyrl(), "sr", "en"));
        } else if (dto.getDescriptionEn() != null) {
            description.setEn(dto.getDescriptionEn());
        }
        product.setDescription(description);
        
        if (product.getSlug() == null || product.getSlug().isEmpty()) {
            product.setSlug(slugUtil.toSlug(dto.getNameSrCyrl()));
        }
        
        product.setPrice(dto.getPrice());
        product.setCurrency(dto.getCurrency());
        product.setImages(dto.getImages() != null ? dto.getImages() : product.getImages());
        product.setActive(dto.isActive());
        product.setStock(dto.getStock());
    }
    
    private ProductDto toDto(Product product, String lang, String script) {
        String name = resolveContent(product.getName(), lang, script);
        String description = resolveContent(product.getDescription(), lang, script);
        
        return ProductDto.builder()
                .id(product.getId())
                .name(name)
                .description(description)
                .slug(product.getSlug())
                .price(product.getPrice())
                .currency(product.getCurrency())
                .images(product.getImages())
                .active(product.isActive())
                .stock(product.getStock())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
    
    private String resolveContent(MultiLanguageContent content, String lang, String script) {
        if (content == null) return "";
        if ("en".equals(lang)) {
            return content.getEn() != null ? content.getEn() : content.getSrCyrl();
        }
        if ("sr".equals(lang) && "latn".equals(script)) {
            return content.getSrLatn() != null ? content.getSrLatn() : content.getSrCyrl();
        }
        return content.getSrCyrl() != null ? content.getSrCyrl() : "";
    }
}
