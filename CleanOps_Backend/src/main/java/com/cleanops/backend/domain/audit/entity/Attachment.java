package com.cleanops.backend.domain.audit.entity;

import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "attachment")
public class Attachment extends BaseTimeEntity {

    @jakarta.persistence.Id
    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "content_type", nullable = false, length = 120)
    private String contentType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "storage_key", nullable = false, length = 512)
    private String storageKey;

    @Column(name = "uploaded_by", nullable = false)
    private Long uploadedBy;

    @Column(name = "uploaded_at", nullable = false)
    private OffsetDateTime uploadedAt;

    protected Attachment() {
    }

    public Attachment(
            String fileName,
            String contentType,
            Long fileSize,
            String storageKey,
            Long uploadedBy,
            OffsetDateTime uploadedAt
    ) {
        this.fileName = fileName;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.storageKey = storageKey;
        this.uploadedBy = uploadedBy;
        this.uploadedAt = uploadedAt;
    }
}

