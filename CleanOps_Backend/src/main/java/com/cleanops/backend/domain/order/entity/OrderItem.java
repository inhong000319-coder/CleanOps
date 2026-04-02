package com.cleanops.backend.domain.order.entity;

import com.cleanops.backend.common.status.OrderItemStatus;
import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import com.cleanops.backend.domain.order.type.ServiceType;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "order_item")
public class OrderItem extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false, length = 32)
    private ServiceType serviceType;

    @Column(name = "item_name", nullable = false, length = 120)
    private String itemName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false, length = 64)
    private OrderItemStatus currentStatus;

    @Column(name = "display_status", nullable = false, length = 120)
    private String displayStatus;

    @Column(name = "status_updated_at", nullable = false)
    private OffsetDateTime statusUpdatedAt;

    @Column(name = "expected_finish_at")
    private OffsetDateTime expectedFinishAt;

    @OneToOne(mappedBy = "orderItem", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private ExternalTag externalTag;

    protected OrderItem() {
    }

    public OrderItem(
            ServiceType serviceType,
            String itemName,
            Integer quantity,
            String notes,
            OrderItemStatus currentStatus,
            OffsetDateTime statusUpdatedAt,
            OffsetDateTime expectedFinishAt
    ) {
        this.serviceType = serviceType;
        this.itemName = itemName;
        this.quantity = quantity;
        this.notes = notes;
        this.currentStatus = currentStatus;
        this.displayStatus = currentStatus.getDisplayStatus();
        this.statusUpdatedAt = statusUpdatedAt;
        this.expectedFinishAt = expectedFinishAt;
    }

    void assignOrder(Order order) {
        this.order = order;
    }

    public void assignExternalTag(ExternalTag externalTag) {
        this.externalTag = externalTag;
        externalTag.assignOrderItem(this);
    }

    public void updateStatus(OrderItemStatus newStatus, OffsetDateTime changedAt) {
        this.currentStatus = newStatus;
        this.displayStatus = newStatus.getDisplayStatus();
        this.statusUpdatedAt = changedAt;
    }

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public String getItemName() {
        return itemName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public String getNotes() {
        return notes;
    }

    public OrderItemStatus getCurrentStatus() {
        return currentStatus;
    }

    public String getDisplayStatus() {
        return displayStatus;
    }

    public OffsetDateTime getStatusUpdatedAt() {
        return statusUpdatedAt;
    }

    public OffsetDateTime getExpectedFinishAt() {
        return expectedFinishAt;
    }

    public ExternalTag getExternalTag() {
        return externalTag;
    }
}

