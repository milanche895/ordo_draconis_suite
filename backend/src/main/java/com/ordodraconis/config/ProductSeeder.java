package com.ordodraconis.config;

import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.model.Product;
import com.ordodraconis.repository.ProductRepository;
import com.ordodraconis.service.TransliterationService;
import com.ordodraconis.service.TranslationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class ProductSeeder implements CommandLineRunner {
    
    private final ProductRepository productRepository;
    private final TransliterationService transliterationService;
    private final TranslationService translationService;
    
    public ProductSeeder(ProductRepository productRepository, TransliterationService transliterationService,
                        TranslationService translationService) {
        this.productRepository = productRepository;
        this.transliterationService = transliterationService;
        this.translationService = translationService;
    }
    
    @Override
    public void run(String... args) {
        try {
            if (productRepository.count() == 0) {
            // Product 1
            Product p1 = createProduct(
                    "Средњовековни мач - реплика",
                    "Прецизна реплика средњовековног мача са детаљним украсима",
                    "srednjevekovni-mac-replika",
                    new BigDecimal("130"),
                    "EUR"
            );
            productRepository.save(p1);
            
            // Product 2
            Product p2 = createProduct(
                    "Штит са грбом",
                    "Декоративни штит са средњовековним грбом Ордо Драконис",
                    "stit-sa-grbom",
                    new BigDecimal("70"),
                    "EUR"
            );
            productRepository.save(p2);
            
            // Product 3
            Product p3 = createProduct(
                    "Књига средњовековних прича",
                    "Збирка прича и легенди из средњег века",
                    "knjiga-srednjevekovnih-prica",
                    new BigDecimal("22"),
                    "EUR"
            );
            productRepository.save(p3);
            }
        } catch (Exception e) {
            System.err.println("Failed to seed products. MongoDB might not be available yet: " + e.getMessage());
            // Ne bacaj grešku - MongoDB će se povezati kada bude potrebno
        }
    }
    
    private Product createProduct(String nameCyrl, String descCyrl, String slug, BigDecimal price, String currency) {
        MultiLanguageContent name = new MultiLanguageContent();
        name.setSrCyrl(nameCyrl);
        name.setSrLatn(transliterationService.transliterate(nameCyrl));
        name.setEn(translationService.translate(nameCyrl, "sr", "en"));
        
        MultiLanguageContent description = new MultiLanguageContent();
        description.setSrCyrl(descCyrl);
        description.setSrLatn(transliterationService.transliterate(descCyrl));
        description.setEn(translationService.translate(descCyrl, "sr", "en"));
        
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setSlug(slug);
        product.setPrice(price);
        product.setCurrency(currency);
        product.setActive(true);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        
        return product;
    }
}
