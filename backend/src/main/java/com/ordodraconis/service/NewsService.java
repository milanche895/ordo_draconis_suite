package com.ordodraconis.service;

import com.ordodraconis.dto.NewsCreateUpdateDto;
import com.ordodraconis.dto.NewsDto;
import com.ordodraconis.dto.LocalizedStringsDto;
import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.model.News;
import com.ordodraconis.repository.NewsRepository;
import com.ordodraconis.util.SlugUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NewsService {
    
    private final NewsRepository newsRepository;
    private final TransliterationService transliterationService;
    private final TranslationService translationService;
    private final SlugUtil slugUtil;
    
    public NewsService(NewsRepository newsRepository, TransliterationService transliterationService,
                       TranslationService translationService, SlugUtil slugUtil) {
        this.newsRepository = newsRepository;
        this.transliterationService = transliterationService;
        this.translationService = translationService;
        this.slugUtil = slugUtil;
    }
    
    public Page<NewsDto> getPublishedNews(Pageable pageable, String lang, String script) {
        Pageable sorted = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Order.desc("publishedAt"), Sort.Order.desc("createdAt"))
        );
        return newsRepository.findAll(sorted)
                .map(n -> toDto(n, lang, script));
    }
    
    public Optional<NewsDto> getBySlug(String slug, String lang, String script) {
        return newsRepository.findBySlug(slug)
                .map(n -> toDto(n, lang, script));
    }
    
    public List<NewsDto> getAll(String lang, String script) {
        return newsRepository.findAll().stream()
                .map(n -> toDto(n, lang, script))
                .collect(java.util.stream.Collectors.toList());
    }
    
    public NewsDto create(NewsCreateUpdateDto dto) {
        News news = new News();
        updateNewsFromDto(news, dto);
        news.setCreatedAt(LocalDateTime.now());
        news.setUpdatedAt(LocalDateTime.now());
        news.setPublishedAt(LocalDateTime.now());
        
        news = newsRepository.save(news);
        return toDto(news, "sr", "cyrl");
    }
    
    public NewsDto update(String id, NewsCreateUpdateDto dto) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));
        
        updateNewsFromDto(news, dto);
        news.setUpdatedAt(LocalDateTime.now());
        
        if (news.getPublishedAt() == null) {
            news.setPublishedAt(LocalDateTime.now());
        }
        
        news = newsRepository.save(news);
        return toDto(news, "sr", "cyrl");
    }
    
    public void delete(String id) {
        newsRepository.deleteById(id);
    }
    
    @Transactional
    private void updateNewsFromDto(News news, NewsCreateUpdateDto dto) {
        // Title
        MultiLanguageContent title = new MultiLanguageContent();
        title.setSrCyrl(dto.getTitleSrCyrl());
        title.setSrLatn(dto.getTitleSrLatn() != null ? dto.getTitleSrLatn() : 
                transliterationService.transliterate(dto.getTitleSrCyrl()));
        
        if (dto.getTitleEn() != null && !dto.getTitleEn().isEmpty()) {
            title.setEn(dto.getTitleEn());
        } else if (news.getTitle() != null && news.getTitle().getEn() != null
                && !news.getTitle().getEn().isBlank()) {
            title.setEn(news.getTitle().getEn());
        } else {
            title.setEn(translationService.translate(dto.getTitleSrCyrl(), "sr", "en"));
        }
        news.setTitle(title);
        
        // Summary
        MultiLanguageContent summary = new MultiLanguageContent();
        summary.setSrCyrl(dto.getSummarySrCyrl());
        summary.setSrLatn(dto.getSummarySrLatn() != null ? dto.getSummarySrLatn() : 
                transliterationService.transliterate(dto.getSummarySrCyrl()));
        
        if (dto.getSummaryEn() != null && !dto.getSummaryEn().isEmpty()) {
            summary.setEn(dto.getSummaryEn());
        } else if (news.getSummary() != null && news.getSummary().getEn() != null
                && !news.getSummary().getEn().isBlank()) {
            summary.setEn(news.getSummary().getEn());
        } else {
            summary.setEn(translationService.translate(dto.getSummarySrCyrl(), "sr", "en"));
        }
        news.setSummary(summary);
        
        // Content
        MultiLanguageContent content = new MultiLanguageContent();
        content.setSrCyrl(dto.getContentSrCyrl());
        content.setSrLatn(dto.getContentSrLatn() != null ? dto.getContentSrLatn() : 
                transliterationService.transliterate(dto.getContentSrCyrl()));
        
        if (dto.getContentEn() != null && !dto.getContentEn().isEmpty()) {
            content.setEn(dto.getContentEn());
        } else if (news.getContent() != null && news.getContent().getEn() != null
                && !news.getContent().getEn().isBlank()) {
            content.setEn(news.getContent().getEn());
        } else {
            content.setEn(translationService.translate(dto.getContentSrCyrl(), "sr", "en"));
        }
        news.setContent(content);
        
        // Slug
        if (news.getSlug() == null || news.getSlug().isEmpty()) {
            news.setSlug(slugUtil.toSlug(dto.getTitleSrCyrl()));
        }
        
        news.setCoverImage(dto.getCoverImage());
        news.setGalleryImages(dto.getGalleryImages() != null ? dto.getGalleryImages() : news.getGalleryImages());
    }
    
    public NewsDto toDto(News news, String lang, String script) {
        String title = resolveContent(news.getTitle(), lang, script);
        String summary = resolveContent(news.getSummary(), lang, script);
        String content = resolveContent(news.getContent(), lang, script);
        
        return NewsDto.builder()
                .id(news.getId())
                .title(title)
                .summary(summary)
                .content(content)
                .titleLocales(toLocales(news.getTitle()))
                .summaryLocales(toLocales(news.getSummary()))
                .contentLocales(toLocales(news.getContent()))
                .slug(news.getSlug())
                .coverImage(news.getCoverImage())
                .galleryImages(news.getGalleryImages())
                .publishedAt(news.getPublishedAt())
                .createdAt(news.getCreatedAt())
                .updatedAt(news.getUpdatedAt())
                .build();
    }
    
    private String resolveContent(MultiLanguageContent content, String lang, String script) {
        if (content == null) return "";
        
        if ("en".equals(lang)) {
            return content.getEn() != null ? content.getEn() : content.getSrCyrl();
        }
        
        if ("sr".equals(lang)) {
            if ("latn".equals(script)) {
                return content.getSrLatn() != null ? content.getSrLatn() : content.getSrCyrl();
            }
            return content.getSrCyrl() != null ? content.getSrCyrl() : "";
        }
        
        return content.getSrCyrl() != null ? content.getSrCyrl() : "";
    }

    private LocalizedStringsDto toLocales(MultiLanguageContent content) {
        if (content == null) return null;
        LocalizedStringsDto dto = new LocalizedStringsDto();
        dto.setSrCyrl(content.getSrCyrl());
        dto.setSrLatn(content.getSrLatn());
        dto.setEn(content.getEn());
        return dto;
    }
}
