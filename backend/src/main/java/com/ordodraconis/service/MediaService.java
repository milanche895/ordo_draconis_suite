package com.ordodraconis.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ordodraconis.model.Media;
import com.ordodraconis.repository.MediaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MediaService {

    private static final Logger log = LoggerFactory.getLogger(MediaService.class);

    private final MediaRepository mediaRepository;
    private final Cloudinary cloudinary;
    
    public MediaService(MediaRepository mediaRepository, Cloudinary cloudinary) {
        this.mediaRepository = mediaRepository;
        this.cloudinary = cloudinary;
    }
    
    public Media uploadFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String publicId = UUID.randomUUID().toString();
        String contentType = file.getContentType();
        boolean isPdf = contentType != null && contentType.toLowerCase().contains("pdf");

        log.info("uploadFile: start publicId={}, name={}, size={}, isPdf={}", publicId, originalFilename, file.getSize(), isPdf);

        Map<String, Object> uploadOptions = new HashMap<>();
        uploadOptions.put("folder", "ordodraconis");
        uploadOptions.put("public_id", publicId);
        uploadOptions.put("access_mode", "public");
        if (isPdf) {
            uploadOptions.put("resource_type", "raw");
        } else {
            uploadOptions.put("resource_type", "auto");
        }

        Map<String, Object> uploadResult;
        try {
            long t0 = System.currentTimeMillis();
            byte[] bytes = file.getBytes();
            log.info("uploadFile: read {} bytes from multipart in {} ms", bytes.length, System.currentTimeMillis() - t0);
            t0 = System.currentTimeMillis();
            uploadResult = cloudinary.uploader().upload(bytes, uploadOptions);
            log.info("uploadFile: Cloudinary upload done in {} ms", System.currentTimeMillis() - t0);
        } catch (Exception e) {
            log.error("uploadFile: Cloudinary failed for name={}", originalFilename, e);
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }

        String url = (String) uploadResult.get("secure_url");
        String cloudinaryPublicId = (String) uploadResult.get("public_id");
        String resourceType = (String) uploadResult.get("resource_type");
        log.info("uploadFile: Cloudinary result publicId={}, resourceType={}, url={}", cloudinaryPublicId, resourceType, url);

        Media media = new Media();
        media.setFilename(cloudinaryPublicId);
        media.setOriginalFilename(originalFilename);
        media.setContentType(file.getContentType());
        media.setSize(file.getSize());
        media.setPath(url);
        if (resourceType != null) {
            media.setCloudinaryResourceType(resourceType);
        }
        media.setCreatedAt(LocalDateTime.now());

        Media saved = mediaRepository.save(media);
        log.info("uploadFile: MongoDB save ok id={}", saved.getId());
        return saved;
    }
    
    public List<Media> getAll() {
        return mediaRepository.findByDeletedFalse();
    }
    
    public void delete(String id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found"));
        
        try {
            String resourceType = media.getCloudinaryResourceType();
            if (resourceType == null || resourceType.isEmpty()) {
                resourceType = inferResourceTypeFromCloudinaryUrl(media.getPath());
            }
            cloudinary.uploader().destroy(
                    media.getFilename(),
                    ObjectUtils.asMap("resource_type", resourceType != null ? resourceType : "image"));
        } catch (Exception e) {
            // Log error but don't fail if Cloudinary deletion fails
            System.err.println("Failed to delete from Cloudinary: " + e.getMessage());
        }
        
        // Soft delete in database
        media.setDeleted(true);
        mediaRepository.save(media);
    }

    private static String inferResourceTypeFromCloudinaryUrl(String url) {
        if (url == null) {
            return "image";
        }
        if (url.contains("/raw/")) {
            return "raw";
        }
        if (url.contains("/video/")) {
            return "video";
        }
        return "image";
    }
}
