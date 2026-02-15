package com.ordodraconis.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TransliterationService {
    
    private static final Map<Character, String> CYRL_TO_LATN = new HashMap<>();
    
    static {
        CYRL_TO_LATN.put('А', "A"); CYRL_TO_LATN.put('а', "a");
        CYRL_TO_LATN.put('Б', "B"); CYRL_TO_LATN.put('б', "b");
        CYRL_TO_LATN.put('В', "V"); CYRL_TO_LATN.put('в', "v");
        CYRL_TO_LATN.put('Г', "G"); CYRL_TO_LATN.put('г', "g");
        CYRL_TO_LATN.put('Д', "D"); CYRL_TO_LATN.put('д', "d");
        CYRL_TO_LATN.put('Ђ', "Đ"); CYRL_TO_LATN.put('ђ', "đ");
        CYRL_TO_LATN.put('Е', "E"); CYRL_TO_LATN.put('е', "e");
        CYRL_TO_LATN.put('Ж', "Ž"); CYRL_TO_LATN.put('ж', "ž");
        CYRL_TO_LATN.put('З', "Z"); CYRL_TO_LATN.put('з', "z");
        CYRL_TO_LATN.put('И', "I"); CYRL_TO_LATN.put('и', "i");
        CYRL_TO_LATN.put('Ј', "J"); CYRL_TO_LATN.put('ј', "j");
        CYRL_TO_LATN.put('К', "K"); CYRL_TO_LATN.put('к', "k");
        CYRL_TO_LATN.put('Л', "L"); CYRL_TO_LATN.put('л', "l");
        CYRL_TO_LATN.put('Љ', "Lj"); CYRL_TO_LATN.put('љ', "lj");
        CYRL_TO_LATN.put('М', "M"); CYRL_TO_LATN.put('м', "m");
        CYRL_TO_LATN.put('Н', "N"); CYRL_TO_LATN.put('н', "n");
        CYRL_TO_LATN.put('Њ', "Nj"); CYRL_TO_LATN.put('њ', "nj");
        CYRL_TO_LATN.put('О', "O"); CYRL_TO_LATN.put('о', "o");
        CYRL_TO_LATN.put('П', "P"); CYRL_TO_LATN.put('п', "p");
        CYRL_TO_LATN.put('Р', "R"); CYRL_TO_LATN.put('р', "r");
        CYRL_TO_LATN.put('С', "S"); CYRL_TO_LATN.put('с', "s");
        CYRL_TO_LATN.put('Т', "T"); CYRL_TO_LATN.put('т', "t");
        CYRL_TO_LATN.put('Ћ', "Ć"); CYRL_TO_LATN.put('ћ', "ć");
        CYRL_TO_LATN.put('У', "U"); CYRL_TO_LATN.put('у', "u");
        CYRL_TO_LATN.put('Ф', "F"); CYRL_TO_LATN.put('ф', "f");
        CYRL_TO_LATN.put('Х', "H"); CYRL_TO_LATN.put('х', "h");
        CYRL_TO_LATN.put('Ц', "C"); CYRL_TO_LATN.put('ц', "c");
        CYRL_TO_LATN.put('Ч', "Č"); CYRL_TO_LATN.put('ч', "č");
        CYRL_TO_LATN.put('Џ', "Dž"); CYRL_TO_LATN.put('џ', "dž");
        CYRL_TO_LATN.put('Ш', "Š"); CYRL_TO_LATN.put('ш', "š");
    }
    
    public String transliterate(String cyrl) {
        if (cyrl == null || cyrl.isEmpty()) {
            return "";
        }
        
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < cyrl.length(); i++) {
            char ch = cyrl.charAt(i);
            String replacement = CYRL_TO_LATN.get(ch);
            if (replacement != null) {
                result.append(replacement);
            } else {
                result.append(ch);
            }
        }
        return result.toString();
    }
}
