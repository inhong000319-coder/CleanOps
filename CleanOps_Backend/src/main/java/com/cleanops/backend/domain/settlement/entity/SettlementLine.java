package com.cleanops.backend.domain.settlement.entity;

import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import com.cleanops.backend.domain.settlement.type.SettlementLineType;
import com.cleanops.backend.domain.settlement.type.SettlementSourceType;
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

@Entity
@Table(name = "settlement_line")
public class SettlementLine extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "settlement_id", nullable = false)
    private Settlement settlement;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 32)
    private SettlementSourceType sourceType;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(name = "order_item_id")
    private Long orderItemId;

    @Enumerated(EnumType.STRING)
    @Column(name = "line_type", nullable = false, length = 32)
    private SettlementLineType lineType;

    @Column(name = "amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(name = "owner_org_id", nullable = false)
    private Long ownerOrgId;

    @Column(name = "description", length = 1000)
    private String description;

    protected SettlementLine() {
    }

    public SettlementLine(
            SettlementSourceType sourceType,
            Long sourceId,
            Long orderItemId,
            SettlementLineType lineType,
            BigDecimal amount,
            Long ownerOrgId,
            String description
    ) {
        this.sourceType = sourceType;
        this.sourceId = sourceId;
        this.orderItemId = orderItemId;
        this.lineType = lineType;
        this.amount = amount;
        this.ownerOrgId = ownerOrgId;
        this.description = description;
    }

    void assignSettlement(Settlement settlement) {
        this.settlement = settlement;
    }
}

