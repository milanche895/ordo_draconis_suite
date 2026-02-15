package com.ordodraconis.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TranslationService {
    
    @Value("${app.translation.provider:mock}")
    private String provider;
    
    public String translate(String text, String fromLang, String toLang) {
        if (text == null || text.isEmpty()) {
            return "";
        }
        
        if ("mock".equals(provider)) {
            // Mock implementation - returns same text with prefix
            return "[EN] " + text;
        }
        
        // Future: Add OpenAI, DeepL, Google Translate adapters
        // if ("openai".equals(provider)) { ... }
        // if ("deepl".equals(provider)) { ... }
        
        return text;
    }
}
