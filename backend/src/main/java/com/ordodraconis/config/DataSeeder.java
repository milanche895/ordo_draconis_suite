package com.ordodraconis.config;

import com.ordodraconis.model.User;
import com.ordodraconis.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${app.admin.email}")
    private String adminEmail;
    
    @Value("${app.admin.password}")
    private String adminPassword;
    
    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) {
        try {
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                admin.setCreatedAt(LocalDateTime.now());
                userRepository.save(admin);
                System.out.println("Admin user created: " + adminEmail);
            }
        } catch (Exception e) {
            System.err.println("Failed to seed admin user. MongoDB might not be available yet: " + e.getMessage());
            // Ne bacaj grešku - MongoDB će se povezati kada bude potrebno
        }
    }
}
