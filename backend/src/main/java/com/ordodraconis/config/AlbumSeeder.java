package com.ordodraconis.config;

import com.ordodraconis.model.Album;
import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.repository.AlbumRepository;
import com.ordodraconis.service.TransliterationService;
import com.ordodraconis.service.TranslationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AlbumSeeder implements CommandLineRunner {
    
    private final AlbumRepository albumRepository;
    private final TransliterationService transliterationService;
    private final TranslationService translationService;
    
    public AlbumSeeder(AlbumRepository albumRepository, TransliterationService transliterationService,
                      TranslationService translationService) {
        this.albumRepository = albumRepository;
        this.transliterationService = transliterationService;
        this.translationService = translationService;
    }
    
    @Override
    public void run(String... args) {
        try {
            if (albumRepository.count() == 0) {
            Album album1 = createAlbum(
                    "Средњовековни фестивал 2024",
                    "Фотографије са нашег годишњег средњовековног фестивала",
                    LocalDateTime.now().minusMonths(2)
            );
            albumRepository.save(album1);
            
            Album album2 = createAlbum(
                    "Радионице за децу",
                    "Како деца уче средњовековне занате",
                    LocalDateTime.now().minusMonths(1)
            );
            albumRepository.save(album2);
            }
        } catch (Exception e) {
            System.err.println("Failed to seed albums. MongoDB might not be available yet: " + e.getMessage());
            // Ne bacaj grešku - MongoDB će se povezati kada bude potrebno
        }
    }
    
    private Album createAlbum(String titleCyrl, String descCyrl, LocalDateTime eventDate) {
        MultiLanguageContent title = new MultiLanguageContent();
        title.setSrCyrl(titleCyrl);
        title.setSrLatn(transliterationService.transliterate(titleCyrl));
        title.setEn(translationService.translate(titleCyrl, "sr", "en"));
        
        MultiLanguageContent description = new MultiLanguageContent();
        description.setSrCyrl(descCyrl);
        description.setSrLatn(transliterationService.transliterate(descCyrl));
        description.setEn(translationService.translate(descCyrl, "sr", "en"));
        
        Album album = new Album();
        album.setTitle(title);
        album.setDescription(description);
        album.setEventDate(eventDate);
        album.setCreatedAt(LocalDateTime.now());
        album.setUpdatedAt(LocalDateTime.now());
        
        return album;
    }
}
