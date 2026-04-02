package com.cleanops.backend.domain.audit.entity;

import com.cleanops.backend.common.status.OrderItemStatus;
import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import com.cleanops.backend.domain.order.entity.OrderItem;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "status_history")
public class StatusHistory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 64)
    private OrderItemStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 64)
    private OrderItemStatus toStatus;

    @Column(name = "reason_code", length = 64)
    private String reasonCode;

    @Column(name = "reason_text", length = 2000)
    private String reasonText;

    @Column(name = "changed_by_user_id", nullable = false)
    private Long changedByUserId;

    @Column(name = "changed_by_role", nullable = false, length = 64)
    private String changedByRole;

    @Column(name = "changed_at", nullable = false)
    private OffsetDateTime changedAt;

    protected StatusHistory() {
    }

    public StatusHistory(
            OrderItem orderItem,
            OrderItemStatus fromStatus,
            OrderItemStatus toStatus,
            String reasonCode,
            String reasonText,
            Long changedByUserId,
            String changedByRole,
            OffsetDateTime changedAt
    ) {
        this.orderItem = orderItem;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.reasonCode = reasonCode;
        this.reasonText = reasonText;
        this.changedByUserId = changedByUserId;
        this.changedByRole = changedByRole;
        this.changedAt = changedAt;
    }
}

