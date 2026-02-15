package com.ordodraconis.model;

public class MultiLanguageContent {
    private String srCyrl; // Source - required
    private String srLatn; // Auto-generated from srCyrl
    private String en;     // Auto-translated on publish
    
    public MultiLanguageContent() {
    }
    
    public MultiLanguageContent(String srCyrl, String srLatn, String en) {
        this.srCyrl = srCyrl;
        this.srLatn = srLatn;
        this.en = en;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public String getSrCyrl() {
        return srCyrl;
    }
    
    public void setSrCyrl(String srCyrl) {
        this.srCyrl = srCyrl;
    }
    
    public String getSrLatn() {
        return srLatn;
    }
    
    public void setSrLatn(String srLatn) {
        this.srLatn = srLatn;
    }
    
    public String getEn() {
        return en;
    }
    
    public void setEn(String en) {
        this.en = en;
    }
    
    public static class Builder {
        private String srCyrl;
        private String srLatn;
        private String en;
        
        public Builder srCyrl(String srCyrl) {
            this.srCyrl = srCyrl;
            return this;
        }
        
        public Builder srLatn(String srLatn) {
            this.srLatn = srLatn;
            return this;
        }
        
        public Builder en(String en) {
            this.en = en;
            return this;
        }
        
        public MultiLanguageContent build() {
            return new MultiLanguageContent(srCyrl, srLatn, en);
        }
    }
}
