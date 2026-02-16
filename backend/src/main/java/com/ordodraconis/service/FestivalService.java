package com.ordodraconis.service;

import com.ordodraconis.dto.FestivalCreateUpdateDto;
import com.ordodraconis.dto.FestivalDto;
import com.ordodraconis.model.Festival;
import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.repository.FestivalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FestivalService {

    private final FestivalRepository festivalRepository;
    private final TransliterationService transliterationService;

    public FestivalService(FestivalRepository festivalRepository,
                           TransliterationService transliterationService) {
        this.festivalRepository = festivalRepository;
        this.transliterationService = transliterationService;
    }

    public List<FestivalDto> getAll(String lang, String script) {
        return festivalRepository.findAllByOrderByYearDesc().stream()
                .map(item -> toDto(item, lang, script))
                .collect(Collectors.toList());
    }

    public Optional<FestivalDto> getById(String id, String lang, String script) {
        return festivalRepository.findById(id)
                .map(item -> toDto(item, lang, script));
    }

    public Optional<FestivalDto> getByYear(int year, String lang, String script) {
        return festivalRepository.findByYear(year)
                .map(item -> toDto(item, lang, script));
    }

    public Optional<FestivalDto> getBySlug(String slug, String lang, String script) {
        return festivalRepository.findBySlug(slug)
                .map(item -> toDto(item, lang, script));
    }

    public FestivalDto create(FestivalCreateUpdateDto dto) {
        Festival festival = new Festival();
        updateFromDto(festival, dto);
        festival.setCreatedAt(LocalDateTime.now());
        festival.setUpdatedAt(LocalDateTime.now());
        festival = festivalRepository.save(festival);
        return toDto(festival, "sr", "cyrl");
    }

    public FestivalDto update(String id, FestivalCreateUpdateDto dto) {
        Festival festival = festivalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Festival not found"));
        updateFromDto(festival, dto);
        festival.setUpdatedAt(LocalDateTime.now());
        festival = festivalRepository.save(festival);
        return toDto(festival, "sr", "cyrl");
    }

    public void delete(String id) {
        festivalRepository.deleteById(id);
    }

    @Transactional
    private void updateFromDto(Festival festival, FestivalCreateUpdateDto dto) {
        festival.setYear(dto.getYear());

        MultiLanguageContent title = new MultiLanguageContent();
        title.setSrCyrl(dto.getTitleSrCyrl());
        title.setSrLatn(dto.getTitleSrLatn() != null ? dto.getTitleSrLatn() : transliterationService.transliterate(dto.getTitleSrCyrl()));
        title.setEn(dto.getTitleEn());
        festival.setTitle(title);

        MultiLanguageContent description = new MultiLanguageContent();
        description.setSrCyrl(dto.getDescriptionSrCyrl());
        description.setSrLatn(dto.getDescriptionSrLatn() != null ? dto.getDescriptionSrLatn() : transliterationService.transliterate(dto.getDescriptionSrCyrl()));
        description.setEn(dto.getDescriptionEn());
        festival.setDescription(description);

        MultiLanguageContent content = new MultiLanguageContent();
        content.setSrCyrl(dto.getContentSrCyrl());
        content.setSrLatn(dto.getContentSrLatn() != null ? dto.getContentSrLatn() : transliterationService.transliterate(dto.getContentSrCyrl() != null ? dto.getContentSrCyrl() : ""));
        content.setEn(dto.getContentEn());
        festival.setContent(content);

        festival.setCoverImage(dto.getCoverImage());
        festival.setGalleryImages(dto.getGalleryImages() != null ? dto.getGalleryImages() : festival.getGalleryImages());
        festival.setSlug("stit-festival-" + dto.getYear());
    }

    private FestivalDto toDto(Festival festival, String lang, String script) {
        String title = resolveContent(festival.getTitle(), lang, script);
        String description = resolveContent(festival.getDescription(), lang, script);
        String content = resolveContent(festival.getContent(), lang, script);
        return FestivalDto.builder()
                .id(festival.getId())
                .year(festival.getYear())
                .title(title)
                .description(description)
                .content(content)
                .slug(festival.getSlug())
                .coverImage(festival.getCoverImage())
                .galleryImages(festival.getGalleryImages())
                .createdAt(festival.getCreatedAt())
                .updatedAt(festival.getUpdatedAt())
                .build();
    }

    private String resolveContent(MultiLanguageContent mc, String lang, String script) {
        if (mc == null) return "";
        if ("en".equals(lang)) return mc.getEn() != null ? mc.getEn() : mc.getSrCyrl();
        if ("sr".equals(lang) && "latn".equals(script)) return mc.getSrLatn() != null ? mc.getSrLatn() : mc.getSrCyrl();
        return mc.getSrCyrl() != null ? mc.getSrCyrl() : "";
    }
}
