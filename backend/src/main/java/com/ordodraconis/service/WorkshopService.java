package com.ordodraconis.service;

import com.ordodraconis.dto.WorkshopCreateUpdateDto;
import com.ordodraconis.dto.WorkshopDto;
import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.model.Workshop;
import com.ordodraconis.repository.WorkshopRepository;
import com.ordodraconis.util.SlugUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final TransliterationService transliterationService;
    private final SlugUtil slugUtil;

    public WorkshopService(WorkshopRepository workshopRepository,
                           TransliterationService transliterationService,
                           SlugUtil slugUtil) {
        this.workshopRepository = workshopRepository;
        this.transliterationService = transliterationService;
        this.slugUtil = slugUtil;
    }

    public List<WorkshopDto> getAll(String lang, String script) {
        return workshopRepository.findAll().stream()
                .map(w -> toDto(w, lang, script))
                .collect(Collectors.toList());
    }

    public List<WorkshopDto> getActive(String lang, String script) {
        return workshopRepository.findByActiveTrue().stream()
                .map(w -> toDto(w, lang, script))
                .collect(Collectors.toList());
    }

    public Optional<WorkshopDto> getById(String id, String lang, String script) {
        return workshopRepository.findById(id)
                .map(w -> toDto(w, lang, script));
    }

    public Optional<WorkshopDto> getBySlug(String slug, String lang, String script) {
        return workshopRepository.findBySlug(slug)
                .map(w -> toDto(w, lang, script));
    }

    public WorkshopDto create(WorkshopCreateUpdateDto dto) {
        Workshop workshop = new Workshop();
        updateFromDto(workshop, dto);
        workshop.setCreatedAt(LocalDateTime.now());
        workshop.setUpdatedAt(LocalDateTime.now());
        workshop = workshopRepository.save(workshop);
        return toDto(workshop, "sr", "cyrl");
    }

    public WorkshopDto update(String id, WorkshopCreateUpdateDto dto) {
        Workshop workshop = workshopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workshop not found: " + id));
        updateFromDto(workshop, dto);
        workshop.setUpdatedAt(LocalDateTime.now());
        workshop = workshopRepository.save(workshop);
        return toDto(workshop, "sr", "cyrl");
    }

    public void delete(String id) {
        workshopRepository.deleteById(id);
    }

    private void updateFromDto(Workshop workshop, WorkshopCreateUpdateDto dto) {
        MultiLanguageContent title = new MultiLanguageContent();
        title.setSrCyrl(dto.getTitleSrCyrl());
        title.setSrLatn(dto.getTitleSrLatn() != null ? dto.getTitleSrLatn() : transliterationService.transliterate(dto.getTitleSrCyrl()));
        title.setEn(dto.getTitleEn());
        workshop.setTitle(title);

        MultiLanguageContent description = new MultiLanguageContent();
        description.setSrCyrl(dto.getDescriptionSrCyrl());
        description.setSrLatn(dto.getDescriptionSrLatn() != null ? dto.getDescriptionSrLatn() : transliterationService.transliterate(dto.getDescriptionSrCyrl()));
        description.setEn(dto.getDescriptionEn());
        workshop.setDescription(description);

        MultiLanguageContent content = new MultiLanguageContent();
        content.setSrCyrl(dto.getContentSrCyrl());
        content.setSrLatn(dto.getContentSrLatn() != null ? dto.getContentSrLatn() : transliterationService.transliterate(dto.getContentSrCyrl() != null ? dto.getContentSrCyrl() : ""));
        content.setEn(dto.getContentEn());
        workshop.setContent(content);

        workshop.setCoverImage(dto.getCoverImage());
        workshop.setGalleryImages(dto.getGalleryImages() != null ? dto.getGalleryImages() : new ArrayList<>());
        workshop.setDuration(dto.getDuration());
        workshop.setMaxParticipants(dto.getMaxParticipants());
        workshop.setPrice(dto.getPrice());
        workshop.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "RSD");
        workshop.setActive(dto.isActive());

        if (workshop.getSlug() == null || workshop.getSlug().isEmpty()) {
            String slug = slugUtil.toSlug(dto.getTitleSrCyrl() != null ? dto.getTitleSrCyrl() : "");
            if (slug == null || slug.isEmpty()) {
                slug = "workshop-" + UUID.randomUUID().toString().substring(0, 8);
            }
            workshop.setSlug(slug);
        }
    }

    private WorkshopDto toDto(Workshop w, String lang, String script) {
        String title = resolveContent(w.getTitle(), lang, script);
        String description = resolveContent(w.getDescription(), lang, script);
        String content = resolveContent(w.getContent(), lang, script);
        return WorkshopDto.builder()
                .id(w.getId())
                .title(title)
                .description(description)
                .content(content)
                .slug(w.getSlug())
                .coverImage(w.getCoverImage())
                .galleryImages(w.getGalleryImages())
                .duration(w.getDuration())
                .maxParticipants(w.getMaxParticipants())
                .price(w.getPrice())
                .currency(w.getCurrency())
                .active(w.isActive())
                .createdAt(w.getCreatedAt())
                .updatedAt(w.getUpdatedAt())
                .build();
    }

    private String resolveContent(MultiLanguageContent mc, String lang, String script) {
        if (mc == null) return "";
        if ("en".equals(lang)) return mc.getEn() != null ? mc.getEn() : (mc.getSrCyrl() != null ? mc.getSrCyrl() : "");
        if ("sr".equals(lang) && "latn".equals(script)) return mc.getSrLatn() != null ? mc.getSrLatn() : (mc.getSrCyrl() != null ? mc.getSrCyrl() : "");
        return mc.getSrCyrl() != null ? mc.getSrCyrl() : "";
    }
}
