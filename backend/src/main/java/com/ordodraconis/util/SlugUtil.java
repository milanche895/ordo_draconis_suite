package com.ordodraconis.util;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

@Component
public class SlugUtil {
    
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Pattern EDGESDASHES = Pattern.compile("(^-|-$)");
    
    public String toSlug(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        
        // Transliterate Cyrillic to Latin first (basic)
        String noWhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        slug = EDGESDASHES.matcher(slug).replaceAll("");
        
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
