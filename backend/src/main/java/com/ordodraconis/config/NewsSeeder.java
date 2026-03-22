package com.ordodraconis.config;

import com.ordodraconis.model.MultiLanguageContent;
import com.ordodraconis.model.News;
import com.ordodraconis.repository.NewsRepository;
import com.ordodraconis.service.TransliterationService;
import com.ordodraconis.service.TranslationService;
import com.ordodraconis.util.SlugUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NewsSeeder implements CommandLineRunner {
    
    private final NewsRepository newsRepository;
    private final TransliterationService transliterationService;
    private final TranslationService translationService;
    private final SlugUtil slugUtil;
    
    public NewsSeeder(NewsRepository newsRepository, TransliterationService transliterationService,
                     TranslationService translationService, SlugUtil slugUtil) {
        this.newsRepository = newsRepository;
        this.transliterationService = transliterationService;
        this.translationService = translationService;
        this.slugUtil = slugUtil;
    }
    
    @Override
    public void run(String... args) {
        try {
            if (newsRepository.count() == 0) {
            // Seed news 1
            News news1 = createNews(
                    "Добродошли у Ордо Драконис",
                    "Откријте магију средњег века у срцу Грачанице",
                    "Ордо Драконис је тематски парк посвећен средњовековној историји и култури. Наша мисија је да посетиоце пренесемо кроз време и упознамо их са богатством средњовековног наслеђа.",
                    "dobrodosli-u-ordo-draconis"
            );
            newsRepository.save(news1);
            
            // Seed news 2
            News news2 = createNews(
                    "Нова изложба у музеју",
                    "Посетите нашу нову колекцију средњовековних артефаката",
                    "Са поносом представљамо нову изложбу средњовековних артефаката која укључује мачеве, оклопе, керамику и многе друге историјске предмете из периода од 10. до 15. века.",
                    "nova-izlozba-u-muzeju"
            );
            newsRepository.save(news2);
            }
        } catch (Exception e) {
            System.err.println("Failed to seed news. MongoDB might not be available yet: " + e.getMessage());
            // Ne bacaj grešku - MongoDB će se povezati kada bude potrebno
        }
    }
    
    private News createNews(String titleCyrl, String summaryCyrl, String contentCyrl, String slug) {
        MultiLanguageContent title = new MultiLanguageContent();
        title.setSrCyrl(titleCyrl);
        title.setSrLatn(transliterationService.transliterate(titleCyrl));
        title.setEn(translationService.translate(titleCyrl, "sr", "en"));
        
        MultiLanguageContent summary = new MultiLanguageContent();
        summary.setSrCyrl(summaryCyrl);
        summary.setSrLatn(transliterationService.transliterate(summaryCyrl));
        summary.setEn(translationService.translate(summaryCyrl, "sr", "en"));
        
        MultiLanguageContent content = new MultiLanguageContent();
        content.setSrCyrl(contentCyrl);
        content.setSrLatn(transliterationService.transliterate(contentCyrl));
        content.setEn(translationService.translate(contentCyrl, "sr", "en"));
        
        News news = new News();
        news.setTitle(title);
        news.setSummary(summary);
        news.setContent(content);
        news.setSlug(slug);
        news.setPublishedAt(LocalDateTime.now());
        news.setCreatedAt(LocalDateTime.now());
        news.setUpdatedAt(LocalDateTime.now());
        
        return news;
    }
}
