package com.ordodraconis.service;

import com.ordodraconis.dto.AlbumCreateUpdateDto;
import com.ordodraconis.dto.AlbumDto;
import com.ordodraconis.model.Album;
import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.repository.AlbumRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AlbumService {
    
    private final AlbumRepository albumRepository;
    private final TransliterationService transliterationService;
    private final TranslationService translationService;
    
    public AlbumService(AlbumRepository albumRepository, TransliterationService transliterationService,
                       TranslationService translationService) {
        this.albumRepository = albumRepository;
        this.transliterationService = transliterationService;
        this.translationService = translationService;
    }
    
    public List<AlbumDto> getAll(String lang, String script) {
        return albumRepository.findAll().stream()
                .map(a -> toDto(a, lang, script))
                .collect(Collectors.toList());
    }
    
    public Optional<AlbumDto> getById(String id, String lang, String script) {
        return albumRepository.findById(id)
                .map(a -> toDto(a, lang, script));
    }
    
    public AlbumDto create(AlbumCreateUpdateDto dto) {
        Album album = new Album();
        updateAlbumFromDto(album, dto);
        album.setCreatedAt(LocalDateTime.now());
        album.setUpdatedAt(LocalDateTime.now());
        album = albumRepository.save(album);
        return toDto(album, "sr", "cyrl");
    }
    
    public AlbumDto update(String id, AlbumCreateUpdateDto dto) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found"));
        updateAlbumFromDto(album, dto);
        album.setUpdatedAt(LocalDateTime.now());
        album = albumRepository.save(album);
        return toDto(album, "sr", "cyrl");
    }
    
    public void delete(String id) {
        albumRepository.deleteById(id);
    }
    
    @Transactional
    private void updateAlbumFromDto(Album album, AlbumCreateUpdateDto dto) {
        MultiLanguageContent title = new MultiLanguageContent();
        title.setSrCyrl(dto.getTitleSrCyrl());
        title.setSrLatn(dto.getTitleSrLatn() != null ? dto.getTitleSrLatn() : 
                transliterationService.transliterate(dto.getTitleSrCyrl()));
        
        if (dto.getGenerateEn()) {
            title.setEn(dto.getTitleEn() != null ? dto.getTitleEn() : 
                    translationService.translate(dto.getTitleSrCyrl(), "sr", "en"));
        } else if (dto.getTitleEn() != null) {
            title.setEn(dto.getTitleEn());
        }
        album.setTitle(title);
        
        if (dto.getDescriptionSrCyrl() != null) {
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
            album.setDescription(description);
        }
        
        album.setImages(dto.getImages() != null ? dto.getImages() : album.getImages());
        album.setTags(dto.getTags() != null ? dto.getTags() : album.getTags());
        album.setEventDate(dto.getEventDate());
    }
    
    private AlbumDto toDto(Album album, String lang, String script) {
        String title = resolveContent(album.getTitle(), lang, script);
        String description = resolveContent(album.getDescription(), lang, script);
        
        return AlbumDto.builder()
                .id(album.getId())
                .title(title)
                .description(description)
                .images(album.getImages())
                .tags(album.getTags())
                .eventDate(album.getEventDate())
                .createdAt(album.getCreatedAt())
                .updatedAt(album.getUpdatedAt())
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
