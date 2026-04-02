package com.cleanops.backend.domain.audit.entity;

import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_log")
public class AuditLog extends BaseTimeEntity {

    @jakarta.persistence.Id
    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "actor_user_id", nullable = false)
    private Long actorUserId;

    @Column(name = "actor_role", nullable = false, length = 64)
    private String actorRole;

    @Column(name = "reason_text", length = 2000)
    private String reasonText;

    @Column(name = "request_id", nullable = false, length = 120)
    private String requestId;

    @Lob
    @Column(name = "details_json")
    private String detailsJson;

    protected AuditLog() {
    }

    public AuditLog(
            String eventType,
            String entityType,
            Long entityId,
            Long actorUserId,
            String actorRole,
            String reasonText,
            String requestId,
            String detailsJson
    ) {
        this.eventType = eventType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.actorUserId = actorUserId;
        this.actorRole = actorRole;
        this.reasonText = reasonText;
        this.requestId = requestId;
        this.detailsJson = detailsJson;
    }
}

