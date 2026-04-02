package com.cleanops.backend.domain.order.entity;

import com.cleanops.backend.common.status.PaymentStatus;
import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import com.cleanops.backend.domain.order.type.PaymentMethod;
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
@Table(name = "payment")
public class Payment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false, length = 32)
    private PaymentMethod method;

    @Column(name = "amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private PaymentStatus status;

    @Column(name = "allow_postpaid", nullable = false)
    private boolean allowPostpaid;

    @Column(name = "idempotency_key", length = 120)
    private String idempotencyKey;

    @Column(name = "paid_at")
    private OffsetDateTime paidAt;

    protected Payment() {
    }

    public Payment(
            PaymentMethod method,
            BigDecimal amount,
            PaymentStatus status,
            boolean allowPostpaid,
            String idempotencyKey,
            OffsetDateTime paidAt
    ) {
        this.method = method;
        this.amount = amount;
        this.status = status;
        this.allowPostpaid = allowPostpaid;
        this.idempotencyKey = idempotencyKey;
        this.paidAt = paidAt;
    }

    void assignOrder(Order order) {
        this.order = order;
    }

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public boolean isAllowPostpaid() {
        return allowPostpaid;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public OffsetDateTime getPaidAt() {
        return paidAt;
    }
}

