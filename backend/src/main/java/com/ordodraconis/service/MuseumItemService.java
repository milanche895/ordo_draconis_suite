package com.ordodraconis.service;

import com.ordodraconis.dto.MuseumItemCreateUpdateDto;
import com.ordodraconis.dto.MuseumItemDto;
import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.model.MuseumItem;
import com.ordodraconis.repository.MuseumItemRepository;
import com.ordodraconis.util.SlugUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MuseumItemService {

    private final MuseumItemRepository museumItemRepository;
    private final TransliterationService transliterationService;
    private final SlugUtil slugUtil;

    public MuseumItemService(MuseumItemRepository museumItemRepository,
                              TransliterationService transliterationService,
                              SlugUtil slugUtil) {
        this.museumItemRepository = museumItemRepository;
        this.transliterationService = transliterationService;
        this.slugUtil = slugUtil;
    }

    public long count() {
        return museumItemRepository.count();
    }

    public List<MuseumItemDto> getActive(String lang, String script) {
        return museumItemRepository.findByActiveTrue().stream()
                .map(item -> toDto(item, lang, script))
                .collect(Collectors.toList());
    }

    public List<MuseumItemDto> getAll(String lang, String script) {
        return museumItemRepository.findAll().stream()
                .map(item -> toDto(item, lang, script))
                .collect(Collectors.toList());
    }

    public Optional<MuseumItemDto> getById(String id, String lang, String script) {
        return museumItemRepository.findById(id)
                .map(item -> toDto(item, lang, script));
    }

    public MuseumItemDto create(MuseumItemCreateUpdateDto dto) {
        MuseumItem item = new MuseumItem();
        updateFromDto(item, dto);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        item = museumItemRepository.save(item);
        return toDto(item, "sr", "cyrl");
    }

    public MuseumItemDto update(String id, MuseumItemCreateUpdateDto dto) {
        MuseumItem item = museumItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Museum item not found"));
        updateFromDto(item, dto);
        item.setUpdatedAt(LocalDateTime.now());
        item = museumItemRepository.save(item);
        return toDto(item, "sr", "cyrl");
    }

    public void delete(String id) {
        museumItemRepository.deleteById(id);
    }

    @Transactional
    private void updateFromDto(MuseumItem item, MuseumItemCreateUpdateDto dto) {
        MultiLanguageContent title = new MultiLanguageContent();
        title.setSrCyrl(dto.getTitleSrCyrl());
        title.setSrLatn(dto.getTitleSrLatn() != null ? dto.getTitleSrLatn() : transliterationService.transliterate(dto.getTitleSrCyrl()));
        title.setEn(dto.getTitleEn());
        item.setTitle(title);

        MultiLanguageContent description = new MultiLanguageContent();
        description.setSrCyrl(dto.getDescriptionSrCyrl());
        description.setSrLatn(dto.getDescriptionSrLatn() != null ? dto.getDescriptionSrLatn() : transliterationService.transliterate(dto.getDescriptionSrCyrl()));
        description.setEn(dto.getDescriptionEn());
        item.setDescription(description);

        MultiLanguageContent content = new MultiLanguageContent();
        content.setSrCyrl(dto.getContentSrCyrl());
        content.setSrLatn(dto.getContentSrLatn() != null ? dto.getContentSrLatn() : transliterationService.transliterate(dto.getContentSrCyrl() != null ? dto.getContentSrCyrl() : ""));
        content.setEn(dto.getContentEn());
        item.setContent(content);

        item.setCoverImage(dto.getCoverImage());
        item.setGalleryImages(dto.getGalleryImages() != null ? dto.getGalleryImages() : item.getGalleryImages());
        item.setCategory(dto.getCategory());
        item.setPeriod(dto.getPeriod());
        item.setOrigin(dto.getOrigin());
        item.setFeatured(dto.isFeatured());
        item.setActive(dto.isActive());

        if (item.getSlug() == null || item.getSlug().isEmpty()) {
            String slug = slugUtil.toSlug(dto.getTitleSrCyrl() != null ? dto.getTitleSrCyrl() : "");
            if (slug == null || slug.isEmpty()) {
                slug = "item-" + UUID.randomUUID().toString().substring(0, 8);
            }
            item.setSlug(slug);
        }
    }

    private MuseumItemDto toDto(MuseumItem item, String lang, String script) {
        String title = resolveContent(item.getTitle(), lang, script);
        String description = resolveContent(item.getDescription(), lang, script);
        String content = resolveContent(item.getContent(), lang, script);
        return MuseumItemDto.builder()
                .id(item.getId())
                .title(title)
                .description(description)
                .content(content)
                .slug(item.getSlug())
                .coverImage(item.getCoverImage())
                .category(item.getCategory())
                .period(item.getPeriod())
                .origin(item.getOrigin())
                .featured(item.isFeatured())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    private String resolveContent(MultiLanguageContent mc, String lang, String script) {
        if (mc == null) return "";
        if ("en".equals(lang)) return mc.getEn() != null ? mc.getEn() : mc.getSrCyrl();
        if ("sr".equals(lang) && "latn".equals(script)) return mc.getSrLatn() != null ? mc.getSrLatn() : mc.getSrCyrl();
        return mc.getSrCyrl() != null ? mc.getSrCyrl() : "";
    }
}
