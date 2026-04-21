package com.ordodraconis.service;

import com.ordodraconis.dto.GalleryAdminAlbumDto;
import com.ordodraconis.dto.GalleryAlbumDto;
import com.ordodraconis.dto.GalleryCustomAlbumRequest;
import com.ordodraconis.dto.LocalizedStringsDto;
import com.ordodraconis.model.Festival;
import com.ordodraconis.model.GalleryAlbumConfig;
import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.model.MuseumItem;
import com.ordodraconis.model.News;
import com.ordodraconis.model.PageIntro;
import com.ordodraconis.model.Product;
import com.ordodraconis.model.Workshop;
import com.ordodraconis.repository.FestivalRepository;
import com.ordodraconis.repository.GalleryAlbumConfigRepository;
import com.ordodraconis.repository.MuseumItemRepository;
import com.ordodraconis.repository.NewsRepository;
import com.ordodraconis.repository.PageIntroRepository;
import com.ordodraconis.repository.ProductRepository;
import com.ordodraconis.repository.WorkshopRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class GalleryService {

    private final FestivalRepository festivalRepository;
    private final MuseumItemRepository museumItemRepository;
    private final WorkshopRepository workshopRepository;
    private final PageIntroRepository pageIntroRepository;
    private final NewsRepository newsRepository;
    private final ProductRepository productRepository;
    private final GalleryAlbumConfigRepository galleryAlbumConfigRepository;
    private final TransliterationService transliterationService;

    public GalleryService(FestivalRepository festivalRepository,
                          MuseumItemRepository museumItemRepository,
                          WorkshopRepository workshopRepository,
                          PageIntroRepository pageIntroRepository,
                          NewsRepository newsRepository,
                          ProductRepository productRepository,
                          GalleryAlbumConfigRepository galleryAlbumConfigRepository,
                          TransliterationService transliterationService) {
        this.festivalRepository = festivalRepository;
        this.museumItemRepository = museumItemRepository;
        this.workshopRepository = workshopRepository;
        this.pageIntroRepository = pageIntroRepository;
        this.newsRepository = newsRepository;
        this.productRepository = productRepository;
        this.galleryAlbumConfigRepository = galleryAlbumConfigRepository;
        this.transliterationService = transliterationService;
    }

    public List<GalleryAlbumDto> getGalleryAlbums(String lang, String script) {
        List<GalleryAlbumDto> albums = buildDefaultAlbums(lang, script);
        Map<String, GalleryAlbumConfig> defaultConfigs = getDefaultConfigMap();

        for (GalleryAlbumDto album : albums) {
            GalleryAlbumConfig cfg = defaultConfigs.get(album.getId());
            if (cfg == null) {
                continue;
            }

            List<String> merged = new ArrayList<>(album.getImages());
            addImages(merged, cfg.getImages());

            Set<String> removed = new LinkedHashSet<>();
            addImages(removed, cfg.getRemovedImages());
            if (!removed.isEmpty()) {
                merged.removeIf(removed::contains);
            }

            album.setImages(deduplicate(merged));
        }

        for (GalleryAlbumConfig custom : galleryAlbumConfigRepository.findByCustom(true)) {
            albums.add(toPublicCustomDto(custom, lang, script));
        }

        return albums;
    }

    public List<GalleryAdminAlbumDto> getAdminAlbums() {
        List<GalleryAdminAlbumDto> out = new ArrayList<>();

        List<GalleryAlbumDto> defaultAlbums = buildDefaultAlbums("sr", "cyrl");
        Map<String, GalleryAlbumConfig> defaultConfigs = getDefaultConfigMap();
        for (GalleryAlbumDto defaultAlbum : defaultAlbums) {
            GalleryAlbumConfig cfg = defaultConfigs.get(defaultAlbum.getId());

            List<String> merged = new ArrayList<>(defaultAlbum.getImages());
            if (cfg != null) {
                addImages(merged, cfg.getImages());
                Set<String> removed = new LinkedHashSet<>();
                addImages(removed, cfg.getRemovedImages());
                if (!removed.isEmpty()) {
                    merged.removeIf(removed::contains);
                }
            }

            GalleryAdminAlbumDto dto = new GalleryAdminAlbumDto();
            dto.setId(defaultAlbum.getId());
            dto.setKey(defaultAlbum.getId());
            dto.setType("DEFAULT");
            dto.setTitle(defaultAlbum.getTitle());
            dto.setTitleLocales(defaultAlbum.getTitleLocales());
            dto.setImages(deduplicate(merged));
            out.add(dto);
        }

        for (GalleryAlbumConfig custom : galleryAlbumConfigRepository.findByCustom(true)) {
            out.add(toAdminCustomDto(custom));
        }

        return out;
    }

    public GalleryAdminAlbumDto createCustomAlbum(GalleryCustomAlbumRequest request) {
        GalleryAlbumConfig cfg = new GalleryAlbumConfig();
        cfg.setId("custom-" + UUID.randomUUID());
        cfg.setKey(cfg.getId());
        cfg.setCustom(true);
        cfg.setTitle(toTitle(request));
        cfg.setImages(deduplicate(request.getImages()));
        cfg.setRemovedImages(new ArrayList<>());
        cfg.setCreatedAt(LocalDateTime.now());
        cfg.setUpdatedAt(LocalDateTime.now());
        return toAdminCustomDto(galleryAlbumConfigRepository.save(cfg));
    }

    public GalleryAdminAlbumDto updateCustomAlbum(String id, GalleryCustomAlbumRequest request) {
        GalleryAlbumConfig cfg = galleryAlbumConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custom album not found"));
        if (!cfg.isCustom()) {
            throw new RuntimeException("Album is not custom");
        }

        cfg.setTitle(toTitle(request));
        cfg.setImages(deduplicate(request.getImages()));
        cfg.setUpdatedAt(LocalDateTime.now());
        return toAdminCustomDto(galleryAlbumConfigRepository.save(cfg));
    }

    public void deleteCustomAlbum(String id) {
        GalleryAlbumConfig cfg = galleryAlbumConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custom album not found"));
        if (!cfg.isCustom()) {
            throw new RuntimeException("Album is not custom");
        }
        galleryAlbumConfigRepository.deleteById(id);
    }

    public GalleryAdminAlbumDto updateDefaultAlbumImages(String key, List<String> desiredImages) {
        GalleryAlbumDto base = buildDefaultAlbums("sr", "cyrl").stream()
                .filter(a -> key.equals(a.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Default album not found: " + key));

        List<String> cleanDesired = deduplicate(desiredImages);
        Set<String> baseSet = new LinkedHashSet<>(base.getImages());
        Set<String> desiredSet = new LinkedHashSet<>(cleanDesired);

        List<String> added = new ArrayList<>();
        for (String image : cleanDesired) {
            if (!baseSet.contains(image)) {
                added.add(image);
            }
        }

        List<String> removed = new ArrayList<>();
        for (String image : base.getImages()) {
            if (!desiredSet.contains(image)) {
                removed.add(image);
            }
        }

        GalleryAlbumConfig cfg = galleryAlbumConfigRepository.findByCustomFalseAndKey(key)
                .orElseGet(() -> {
                    GalleryAlbumConfig created = new GalleryAlbumConfig();
                    created.setId("default-" + key);
                    created.setKey(key);
                    created.setCustom(false);
                    created.setCreatedAt(LocalDateTime.now());
                    return created;
                });

        cfg.setImages(added);
        cfg.setRemovedImages(removed);
        cfg.setUpdatedAt(LocalDateTime.now());
        galleryAlbumConfigRepository.save(cfg);

        GalleryAdminAlbumDto dto = new GalleryAdminAlbumDto();
        dto.setId(key);
        dto.setKey(key);
        dto.setType("DEFAULT");
        dto.setTitle(base.getTitle());
        dto.setTitleLocales(base.getTitleLocales());
        dto.setImages(cleanDesired);
        return dto;
    }

    private List<GalleryAlbumDto> buildDefaultAlbums(String lang, String script) {
        List<GalleryAlbumDto> albums = new ArrayList<>();
        albums.add(buildShieldFestivalAlbum(lang, script));
        albums.add(buildMuzejAlbum(lang, script));
        albums.add(buildRadioniceAlbum(lang, script));
        albums.add(buildKrcmaAlbum(lang, script));
        albums.add(buildVestiAlbum(lang, script));
        albums.add(buildProdavnicaAlbum(lang, script));
        return albums;
    }

    private GalleryAlbumDto buildShieldFestivalAlbum(String lang, String script) {
        List<String> images = new ArrayList<>();
        for (Festival festival : festivalRepository.findAllByOrderByYearDesc()) {
            addImage(images, festival.getCoverImage());
            addImages(images, festival.getGalleryImages());
        }
        return buildAlbum("shield-festival", lang, script,
                "Штит фестивал", "Stit festival", "Shield Festival", images);
    }

    private GalleryAlbumDto buildMuzejAlbum(String lang, String script) {
        List<String> images = new ArrayList<>();
        for (MuseumItem item : museumItemRepository.findByActiveTrue()) {
            addImage(images, item.getCoverImage());
            addImages(images, item.getGalleryImages());
        }
        return buildAlbum("muzej", lang, script,
                "Музеј", "Muzej", "Museum", images);
    }

    private GalleryAlbumDto buildRadioniceAlbum(String lang, String script) {
        List<String> images = new ArrayList<>();
        for (Workshop workshop : workshopRepository.findByActiveTrue()) {
            addImage(images, workshop.getCoverImage());
            addImages(images, workshop.getGalleryImages());
        }
        return buildAlbum("radionice", lang, script,
                "Радионице", "Radionice", "Workshops", images);
    }

    private GalleryAlbumDto buildKrcmaAlbum(String lang, String script) {
        List<String> images = pageIntroRepository.findById(PageIntro.KRCMA)
                .map(PageIntro::getGalleryImages)
                .orElseGet(ArrayList::new);

        return buildAlbum("krcma", lang, script,
                "Крчма", "Krcma", "Tavern", images);
    }

    private GalleryAlbumDto buildVestiAlbum(String lang, String script) {
        List<String> images = new ArrayList<>();
        for (News news : newsRepository.findAll()) {
            addImage(images, news.getCoverImage());
            addImages(images, news.getGalleryImages());
        }
        return buildAlbum("vesti", lang, script,
                "Вести", "Vesti", "News", images);
    }

    private GalleryAlbumDto buildProdavnicaAlbum(String lang, String script) {
        List<String> images = new ArrayList<>();
        for (Product product : productRepository.findByActiveTrue()) {
            addImages(images, product.getImages());
        }
        return buildAlbum("prodavnica", lang, script,
                "Продавница", "Prodavnica", "Shop", images);
    }

    private GalleryAlbumDto buildAlbum(String id,
                                       String lang,
                                       String script,
                                       String srCyrl,
                                       String srLatn,
                                       String en,
                                       List<String> images) {
        LocalizedStringsDto locales = new LocalizedStringsDto();
        locales.setSrCyrl(srCyrl);
        locales.setSrLatn(srLatn);
        locales.setEn(en);

        return GalleryAlbumDto.builder()
                .id(id)
                .title(resolveTitle(locales, lang, script))
                .titleLocales(locales)
                .description("")
                .images(deduplicate(images))
                .build();
    }

    private GalleryAlbumDto toPublicCustomDto(GalleryAlbumConfig custom, String lang, String script) {
        LocalizedStringsDto locales = toLocales(custom.getTitle());
        GalleryAlbumDto dto = new GalleryAlbumDto();
        dto.setId(custom.getId());
        dto.setTitle(resolveTitle(locales, lang, script));
        dto.setTitleLocales(locales);
        dto.setDescription("");
        dto.setImages(deduplicate(custom.getImages()));
        return dto;
    }

    private GalleryAdminAlbumDto toAdminCustomDto(GalleryAlbumConfig custom) {
        GalleryAdminAlbumDto dto = new GalleryAdminAlbumDto();
        dto.setId(custom.getId());
        dto.setKey(custom.getKey());
        dto.setType("CUSTOM");
        dto.setTitle(resolveTitle(toLocales(custom.getTitle()), "sr", "cyrl"));
        dto.setTitleLocales(toLocales(custom.getTitle()));
        dto.setImages(deduplicate(custom.getImages()));
        return dto;
    }

    private Map<String, GalleryAlbumConfig> getDefaultConfigMap() {
        Map<String, GalleryAlbumConfig> map = new HashMap<>();
        for (GalleryAlbumConfig cfg : galleryAlbumConfigRepository.findByCustom(false)) {
            if (cfg.getKey() != null && !cfg.getKey().isBlank()) {
                map.put(cfg.getKey(), cfg);
            }
        }
        return map;
    }

    private String resolveTitle(LocalizedStringsDto locales, String lang, String script) {
        if (locales == null) {
            return "";
        }
        if ("en".equals(lang)) {
            return locales.getEn() != null ? locales.getEn() : (locales.getSrCyrl() != null ? locales.getSrCyrl() : "");
        }
        if ("sr".equals(lang) && "latn".equals(script)) {
            return locales.getSrLatn() != null ? locales.getSrLatn() : (locales.getSrCyrl() != null ? locales.getSrCyrl() : "");
        }
        return locales.getSrCyrl() != null ? locales.getSrCyrl() : "";
    }

    private LocalizedStringsDto toLocales(MultiLanguageContent title) {
        if (title == null) {
            return new LocalizedStringsDto();
        }
        LocalizedStringsDto dto = new LocalizedStringsDto();
        dto.setSrCyrl(title.getSrCyrl());
        dto.setSrLatn(title.getSrLatn());
        dto.setEn(title.getEn());
        return dto;
    }

    private MultiLanguageContent toTitle(GalleryCustomAlbumRequest request) {
        MultiLanguageContent title = new MultiLanguageContent();
        title.setSrCyrl(request.getTitleSrCyrl());
        title.setSrLatn(request.getTitleSrLatn() != null && !request.getTitleSrLatn().isBlank()
                ? request.getTitleSrLatn()
                : transliterationService.transliterate(request.getTitleSrCyrl() != null ? request.getTitleSrCyrl() : ""));
        title.setEn(request.getTitleEn());
        return title;
    }

    private List<String> deduplicate(List<String> images) {
        Set<String> ordered = new LinkedHashSet<>();
        addImages(ordered, images);
        return new ArrayList<>(ordered);
    }

    private void addImage(List<String> target, String image) {
        if (image != null && !image.isBlank()) {
            target.add(image);
        }
    }

    private void addImages(List<String> target, List<String> images) {
        if (images == null) {
            return;
        }
        for (String image : images) {
            addImage(target, image);
        }
    }

    private void addImages(Set<String> target, List<String> images) {
        if (images == null) {
            return;
        }
        for (String image : images) {
            if (image != null && !image.isBlank()) {
                target.add(image);
            }
        }
    }
}