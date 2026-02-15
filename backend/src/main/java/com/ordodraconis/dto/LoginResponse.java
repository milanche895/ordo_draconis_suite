package com.ordodraconis.dto;

public class LoginResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String email;
    private String role;
    
    public LoginResponse() {
    }
    
    public LoginResponse(String accessToken, String tokenType, String email, String role) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.email = email;
        this.role = role;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public static class Builder {
        private String accessToken;
        private String tokenType = "Bearer";
        private String email;
        private String role;
        
        public Builder accessToken(String accessToken) {
            this.accessToken = accessToken;
            return this;
        }
        
        public Builder tokenType(String tokenType) {
            this.tokenType = tokenType;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder role(String role) {
            this.role = role;
            return this;
        }
        
        public LoginResponse build() {
            return new LoginResponse(accessToken, tokenType, email, role);
        }
    }
}
