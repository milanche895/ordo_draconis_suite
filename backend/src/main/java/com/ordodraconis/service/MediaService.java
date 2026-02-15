package com.ordodraconis.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ordodraconis.model.Media;
import com.ordodraconis.repository.MediaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MediaService {
    
    private final MediaRepository mediaRepository;
    private final Cloudinary cloudinary;
    
    public MediaService(MediaRepository mediaRepository, Cloudinary cloudinary) {
        this.mediaRepository = mediaRepository;
        this.cloudinary = cloudinary;
    }
    
    public Media uploadFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String publicId = "ordodraconis/" + UUID.randomUUID().toString();
        
        Map<String, Object> uploadResult;
        try {
            uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "auto",
                            "folder", "ordodraconis"
                    )
            );
        } catch (Exception e) {
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
        
        String url = (String) uploadResult.get("secure_url");
        String cloudinaryPublicId = (String) uploadResult.get("public_id");
        
        Media media = new Media();
        media.setFilename(cloudinaryPublicId);
        media.setOriginalFilename(originalFilename);
        media.setContentType(file.getContentType());
        media.setSize(file.getSize());
        media.setPath(url); // Store Cloudinary URL in path field
        media.setCreatedAt(LocalDateTime.now());
        
        return mediaRepository.save(media);
    }
    
    public List<Media> getAll() {
        return mediaRepository.findByDeletedFalse();
    }
    
    public void delete(String id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found"));
        
        // Delete from Cloudinary
        try {
            cloudinary.uploader().destroy(media.getFilename(), ObjectUtils.emptyMap());
        } catch (Exception e) {
            // Log error but don't fail if Cloudinary deletion fails
            System.err.println("Failed to delete from Cloudinary: " + e.getMessage());
        }
        
        // Soft delete in database
        media.setDeleted(true);
        mediaRepository.save(media);
    }
}
