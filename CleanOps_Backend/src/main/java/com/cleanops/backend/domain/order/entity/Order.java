package com.cleanops.backend.domain.order.entity;

import com.cleanops.backend.common.status.PaymentStatus;
import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import com.cleanops.backend.domain.order.type.OrderType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_no", nullable = false, unique = true, length = 64)
    private String orderNo;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "store_id", nullable = false)
    private Long storeId;

    @Column(name = "region_id")
    private Long regionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", nullable = false, length = 32)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 32)
    private PaymentStatus paymentStatus;

    @Column(name = "policy_snapshot_id")
    private Long policySnapshotId;

    @Column(name = "policy_decision", length = 64)
    private String policyDecision;

    @Column(name = "status_updated_at", nullable = false)
    private OffsetDateTime statusUpdatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Refund> refunds = new ArrayList<>();

    protected Order() {
    }

    public Order(
            String orderNo,
            Long customerId,
            Long storeId,
            Long regionId,
            OrderType orderType,
            PaymentStatus paymentStatus,
            Long policySnapshotId,
            String policyDecision,
            OffsetDateTime statusUpdatedAt
    ) {
        this.orderNo = orderNo;
        this.customerId = customerId;
        this.storeId = storeId;
        this.regionId = regionId;
        this.orderType = orderType;
        this.paymentStatus = paymentStatus;
        this.policySnapshotId = policySnapshotId;
        this.policyDecision = policyDecision;
        this.statusUpdatedAt = statusUpdatedAt;
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.assignOrder(this);
    }

    public void addPayment(Payment payment) {
        payments.add(payment);
        payment.assignOrder(this);
    }

    public void addRefund(Refund refund) {
        refunds.add(refund);
        refund.assignOrder(this);
    }

    public Long getId() {
        return id;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Long getStoreId() {
        return storeId;
    }

    public Long getRegionId() {
        return regionId;
    }

    public OrderType getOrderType() {
        return orderType;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public Long getPolicySnapshotId() {
        return policySnapshotId;
    }

    public String getPolicyDecision() {
        return policyDecision;
    }

    public OffsetDateTime getStatusUpdatedAt() {
        return statusUpdatedAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void updatePaymentStatus(PaymentStatus paymentStatus, OffsetDateTime updatedAt) {
        this.paymentStatus = paymentStatus;
        this.statusUpdatedAt = updatedAt;
    }
}

