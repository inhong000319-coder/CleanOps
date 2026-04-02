package com.cleanops.backend.domain.order.entity;

import com.cleanops.backend.common.status.RefundStatus;
import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import com.cleanops.backend.domain.order.type.RefundType;
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

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "refund")
public class Refund extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "refund_no", nullable = false, unique = true, length = 64)
    private String refundNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "refund_type", nullable = false, length = 32)
    private RefundType refundType;

    @Column(name = "refund_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal refundAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "refund_status", nullable = false, length = 32)
    private RefundStatus refundStatus;

    @Column(name = "reason_code", length = 64)
    private String reasonCode;

    @Column(name = "reason_text", length = 2000)
    private String reasonText;

    @Column(name = "approval_required", nullable = false)
    private boolean approvalRequired;

    @Column(name = "attachment_required", nullable = false)
    private boolean attachmentRequired;

    @Column(name = "report_required", nullable = false)
    private boolean reportRequired;

    @Column(name = "requested_by_user_id", nullable = false)
    private Long requestedByUserId;

    @Column(name = "requested_at", nullable = false)
    private OffsetDateTime requestedAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    protected Refund() {
    }

    public Refund(
            String refundNo,
            RefundType refundType,
            BigDecimal refundAmount,
            RefundStatus refundStatus,
            String reasonCode,
            String reasonText,
            boolean approvalRequired,
            boolean attachmentRequired,
            boolean reportRequired,
            Long requestedByUserId,
            OffsetDateTime requestedAt
    ) {
        this.refundNo = refundNo;
        this.refundType = refundType;
        this.refundAmount = refundAmount;
        this.refundStatus = refundStatus;
        this.reasonCode = reasonCode;
        this.reasonText = reasonText;
        this.approvalRequired = approvalRequired;
        this.attachmentRequired = attachmentRequired;
        this.reportRequired = reportRequired;
        this.requestedByUserId = requestedByUserId;
        this.requestedAt = requestedAt;
    }

    void assignOrder(Order order) {
        this.order = order;
    }

    public Long getId() {
        return id;
    }
}

