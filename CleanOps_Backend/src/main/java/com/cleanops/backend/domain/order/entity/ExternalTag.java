package com.cleanops.backend.domain.order.entity;

import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "external_tag",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_external_tag_order_item", columnNames = {"order_item_id"}),
                @UniqueConstraint(name = "uk_external_tag_full_no", columnNames = {"tag_full_no"})
        }
)
public class ExternalTag extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_item_id", nullable = false, unique = true)
    private OrderItem orderItem;

    @Column(name = "tag_full_no", nullable = false, length = 100, unique = true)
    private String tagFullNo;

    @Column(name = "retired", nullable = false)
    private boolean retired;

    @Column(name = "retired_at")
    private OffsetDateTime retiredAt;

    protected ExternalTag() {
    }

    public ExternalTag(String tagFullNo) {
        this.tagFullNo = tagFullNo;
        this.retired = false;
    }

    void assignOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public void retire(OffsetDateTime retiredAt) {
        this.retired = true;
        this.retiredAt = retiredAt;
    }

    public Long getId() {
        return id;
    }

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public String getTagFullNo() {
        return tagFullNo;
    }

    public boolean isRetired() {
        return retired;
    }

    public OffsetDateTime getRetiredAt() {
        return retiredAt;
    }
}

