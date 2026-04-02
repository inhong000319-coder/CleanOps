package com.cleanops.backend.domain.settlement.entity;

import com.cleanops.backend.common.status.SettlementStatus;
import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
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
@Table(name = "settlement")
public class Settlement extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "settlement_no", nullable = false, unique = true, length = 64)
    private String settlementNo;

    @Column(name = "settlement_period", nullable = false, length = 32)
    private String settlementPeriod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private SettlementStatus status;

    @Column(name = "cutoff_at", nullable = false)
    private OffsetDateTime cutoffAt;

    @Column(name = "draft_writer_user_id", nullable = false)
    private Long draftWriterUserId;

    @Column(name = "confirmer_user_id")
    private Long confirmerUserId;

    @Column(name = "policy_snapshot_id")
    private Long policySnapshotId;

    @Column(name = "confirmed_at")
    private OffsetDateTime confirmedAt;

    @OneToMany(mappedBy = "settlement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SettlementLine> lines = new ArrayList<>();

    @OneToMany(mappedBy = "settlement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SettlementAdjustment> adjustments = new ArrayList<>();

    protected Settlement() {
    }

    public Settlement(
            String settlementNo,
            String settlementPeriod,
            SettlementStatus status,
            OffsetDateTime cutoffAt,
            Long draftWriterUserId,
            Long policySnapshotId
    ) {
        this.settlementNo = settlementNo;
        this.settlementPeriod = settlementPeriod;
        this.status = status;
        this.cutoffAt = cutoffAt;
        this.draftWriterUserId = draftWriterUserId;
        this.policySnapshotId = policySnapshotId;
    }

    public void addLine(SettlementLine line) {
        lines.add(line);
        line.assignSettlement(this);
    }

    public void addAdjustment(SettlementAdjustment adjustment) {
        adjustments.add(adjustment);
        adjustment.assignSettlement(this);
    }
}

