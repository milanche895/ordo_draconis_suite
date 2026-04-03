package com.ordodraconis.service;

import com.ordodraconis.dto.KrcmaPageAdminDto;
import com.ordodraconis.dto.KrcmaPageDto;
import com.ordodraconis.dto.LocalizedStringsDto;
import com.ordodraconis.dto.PageIntroTextDto;
import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.model.PageIntro;
import com.ordodraconis.repository.PageIntroRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class PageIntroService {

    private final PageIntroRepository pageIntroRepository;
    private final TransliterationService transliterationService;
    private final CloudinaryDeliveryService cloudinaryDeliveryService;

    public PageIntroService(PageIntroRepository pageIntroRepository,
                            TransliterationService transliterationService,
                            CloudinaryDeliveryService cloudinaryDeliveryService) {
        this.pageIntroRepository = pageIntroRepository;
        this.transliterationService = transliterationService;
        this.cloudinaryDeliveryService = cloudinaryDeliveryService;
    }

    public PageIntroTextDto getWorkshopsIntro(String lang, String script) {
        String text = pageIntroRepository.findById(PageIntro.WORKSHOPS)
                .map(p -> resolveContent(p.getDescription(), lang, script))
                .orElse("");
        return new PageIntroTextDto(text);
    }

    public LocalizedStringsDto getWorkshopsIntroForAdmin() {
        return pageIntroRepository.findById(PageIntro.WORKSHOPS)
                .map(p -> toLocales(p.getDescription()))
                .orElseGet(LocalizedStringsDto::new);
    }

    public LocalizedStringsDto updateWorkshopsIntro(LocalizedStringsDto dto) {
        PageIntro doc = pageIntroRepository.findById(PageIntro.WORKSHOPS).orElseGet(() -> {
            PageIntro p = new PageIntro();
            p.setId(PageIntro.WORKSHOPS);
            return p;
        });
        doc.setDescription(fromDto(dto));
        doc.setUpdatedAt(LocalDateTime.now());
        pageIntroRepository.save(doc);
        return toLocales(doc.getDescription());
    }

    public KrcmaPageDto getKrcma(String lang, String script) {
        return pageIntroRepository.findById(PageIntro.KRCMA)
                .map(p -> {
                    String desc = resolveContent(p.getDescription(), lang, script);
                    List<String> imgs = p.getGalleryImages() != null ? p.getGalleryImages() : Collections.emptyList();
                    String pdf = p.getMenuPdfUrl() != null ? p.getMenuPdfUrl().trim() : "";
                    if (!pdf.isEmpty()) {
                        pdf = cloudinaryDeliveryService.signedDeliveryUrl(pdf);
                    }
                    return new KrcmaPageDto(desc, imgs, pdf);
                })
                .orElse(new KrcmaPageDto("", Collections.emptyList(), ""));
    }

    public KrcmaPageAdminDto getKrcmaForAdmin() {
        return pageIntroRepository.findById(PageIntro.KRCMA)
                .map(p -> {
                    KrcmaPageAdminDto d = new KrcmaPageAdminDto();
                    d.setDescription(toLocales(p.getDescription()));
                    d.setGalleryImages(p.getGalleryImages() != null ? new ArrayList<>(p.getGalleryImages()) : new ArrayList<>());
                    d.setMenuPdfUrl(p.getMenuPdfUrl());
                    return d;
                })
                .orElseGet(() -> {
                    KrcmaPageAdminDto d = new KrcmaPageAdminDto();
                    d.setDescription(new LocalizedStringsDto());
                    return d;
                });
    }

    public KrcmaPageAdminDto updateKrcma(KrcmaPageAdminDto dto) {
        PageIntro doc = pageIntroRepository.findById(PageIntro.KRCMA).orElseGet(() -> {
            PageIntro p = new PageIntro();
            p.setId(PageIntro.KRCMA);
            return p;
        });
        LocalizedStringsDto descDto = dto.getDescription();
        if (descDto == null) {
            descDto = new LocalizedStringsDto();
        }
        doc.setDescription(fromDto(descDto));
        doc.setGalleryImages(dto.getGalleryImages() != null ? dto.getGalleryImages() : new ArrayList<>());
        doc.setMenuPdfUrl(dto.getMenuPdfUrl());
        doc.setUpdatedAt(LocalDateTime.now());
        pageIntroRepository.save(doc);
        return getKrcmaForAdmin();
    }

    private MultiLanguageContent fromDto(LocalizedStringsDto dto) {
        MultiLanguageContent mc = new MultiLanguageContent();
        String cyrl = dto.getSrCyrl();
        mc.setSrCyrl(cyrl);
        mc.setSrLatn(dto.getSrLatn() != null ? dto.getSrLatn() : transliterationService.transliterate(cyrl));
        mc.setEn(dto.getEn());
        return mc;
    }

    private String resolveContent(MultiLanguageContent mc, String lang, String script) {
        if (mc == null) {
            return "";
        }
        if ("en".equals(lang)) {
            return mc.getEn() != null ? mc.getEn() : (mc.getSrCyrl() != null ? mc.getSrCyrl() : "");
        }
        if ("sr".equals(lang) && "latn".equals(script)) {
            return mc.getSrLatn() != null ? mc.getSrLatn() : (mc.getSrCyrl() != null ? mc.getSrCyrl() : "");
        }
        return mc.getSrCyrl() != null ? mc.getSrCyrl() : "";
    }

    private LocalizedStringsDto toLocales(MultiLanguageContent mc) {
        if (mc == null) {
            return new LocalizedStringsDto();
        }
        LocalizedStringsDto d = new LocalizedStringsDto();
        d.setSrCyrl(mc.getSrCyrl());
        d.setSrLatn(mc.getSrLatn());
        d.setEn(mc.getEn());
        return d;
    }
}
