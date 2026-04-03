package com.ordodraconis.service;

import com.cloudinary.Cloudinary;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Builds signed delivery URLs for assets on {@code res.cloudinary.com} so the browser and PDF.js
 * can fetch them when the account uses authenticated delivery or strict rules (otherwise GET can return 401).
 */
@Service
public class CloudinaryDeliveryService {

    private static final Pattern CLOUDINARY_PATH = Pattern.compile(
            "^/([^/]+)/(image|video|raw)/(upload|authenticated|private)/(?:(v(\\d+))/)?(.+)$"
    );

    private final Cloudinary cloudinary;

    public CloudinaryDeliveryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Returns a time-limited signed URL for Cloudinary HTTPS URLs; passes through other URLs unchanged.
     */
    public String signedDeliveryUrl(String secureUrl) {
        if (secureUrl == null || secureUrl.isBlank() || !secureUrl.contains("res.cloudinary.com")) {
            return secureUrl;
        }
        try {
            URI uri = URI.create(secureUrl.trim());
            String path = uri.getPath();
            Matcher m = CLOUDINARY_PATH.matcher(path);
            if (!m.matches()) {
                return secureUrl;
            }

            String resourceType = m.group(2);
            String deliveryType = m.group(3);
            String versionDigits = m.group(5);
            String publicIdWithExt = m.group(6);

            long version = 0;
            if (versionDigits != null && !versionDigits.isEmpty()) {
                version = Long.parseLong(versionDigits);
            }

            int lastDot = publicIdWithExt.lastIndexOf('.');
            int lastSlash = publicIdWithExt.lastIndexOf('/');
            String publicId;
            String format = null;
            if (lastDot > lastSlash) {
                publicId = publicIdWithExt.substring(0, lastDot);
                format = publicIdWithExt.substring(lastDot + 1);
            } else {
                publicId = publicIdWithExt;
            }

            com.cloudinary.Url urlBuilder = cloudinary.url()
                    .resourceType(resourceType)
                    .type(deliveryType)
                    .secure(true)
                    .signed(true);
            if (version > 0) {
                urlBuilder.version(version);
            }
            if (format != null && !format.isEmpty()) {
                urlBuilder.format(format);
            }
            return urlBuilder.generate(publicId);
        } catch (Exception e) {
            return secureUrl;
        }
    }
}
