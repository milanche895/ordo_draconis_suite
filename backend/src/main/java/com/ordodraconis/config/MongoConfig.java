package com.ordodraconis.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {
    
    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;
    
    @Value("${spring.data.mongodb.database:ordodraconis}")
    private String databaseName;
    
    @Bean
    @Lazy
    public MongoClient mongoClient() {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                // Lazy connection - ne pokušava da se poveže na startu aplikacije
                // Konekcija će se uspostaviti tek kada je prvi put potrebna
                .applyToClusterSettings(builder -> builder
                        .serverSelectionTimeout(30000, java.util.concurrent.TimeUnit.MILLISECONDS))
                .applyToSocketSettings(builder -> builder
                        .connectTimeout(10000, java.util.concurrent.TimeUnit.MILLISECONDS)
                        .readTimeout(10000, java.util.concurrent.TimeUnit.MILLISECONDS))
                .applyToConnectionPoolSettings(builder -> builder
                        .maxWaitTime(10000, java.util.concurrent.TimeUnit.MILLISECONDS))
                .build();
        
        return MongoClients.create(settings);
    }
    
    @Bean
    @Lazy
    public MongoDatabaseFactory mongoDatabaseFactory() {
        return new SimpleMongoClientDatabaseFactory(mongoClient(), databaseName);
    }
    
    @Bean
    @Lazy
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoDatabaseFactory());
    }
}
