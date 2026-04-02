package com.cleanops.backend.domain.settlement.entity;

import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "settlement_adjustment")
public class SettlementAdjustment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "settlement_id", nullable = false)
    private Settlement settlement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "settlement_line_id")
    private SettlementLine settlementLine;

    @Column(name = "reason_code", nullable = false, length = 64)
    private String reasonCode;

    @Column(name = "reason_text", length = 2000)
    private String reasonText;

    @Column(name = "amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(name = "created_by_user_id", nullable = false)
    private Long createdByUserId;

    protected SettlementAdjustment() {
    }

    public SettlementAdjustment(
            SettlementLine settlementLine,
            String reasonCode,
            String reasonText,
            BigDecimal amount,
            Long createdByUserId
    ) {
        this.settlementLine = settlementLine;
        this.reasonCode = reasonCode;
        this.reasonText = reasonText;
        this.amount = amount;
        this.createdByUserId = createdByUserId;
    }

    void assignSettlement(Settlement settlement) {
        this.settlement = settlement;
    }
}

