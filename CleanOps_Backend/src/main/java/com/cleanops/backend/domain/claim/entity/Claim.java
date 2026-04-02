package com.cleanops.backend.domain.claim.entity;

import com.cleanops.backend.common.status.ClaimStatus;
import com.cleanops.backend.domain.claim.type.ClaimType;
import com.cleanops.backend.domain.common.entity.BaseTimeEntity;
import com.cleanops.backend.domain.common.type.OrgType;
import com.cleanops.backend.domain.order.entity.Order;
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

@Entity
@Table(name = "claim")
public class Claim extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "claim_no", nullable = false, unique = true, length = 64)
    private String claimNo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

    @Enumerated(EnumType.STRING)
    @Column(name = "claim_type", nullable = false, length = 32)
    private ClaimType claimType;

    @Enumerated(EnumType.STRING)
    @Column(name = "claim_status", nullable = false, length = 32)
    private ClaimStatus claimStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_org_type", nullable = false, length = 32)
    private OrgType ownerOrgType;

    @Column(name = "reason_text", length = 2000)
    private String reasonText;

    @Column(name = "customer_request", length = 1000)
    private String customerRequest;

    @Column(name = "approval_required", nullable = false)
    private boolean approvalRequired;

    @Column(name = "attachment_required", nullable = false)
    private boolean attachmentRequired;

    @Column(name = "report_required", nullable = false)
    private boolean reportRequired;

    @Column(name = "urgent", nullable = false)
    private boolean urgent;

    @Column(name = "requested_by_user_id", nullable = false)
    private Long requestedByUserId;

    protected Claim() {
    }

    public Claim(
            String claimNo,
            Order order,
            OrderItem orderItem,
            ClaimType claimType,
            ClaimStatus claimStatus,
            OrgType ownerOrgType,
            String reasonText,
            String customerRequest,
            boolean approvalRequired,
            boolean attachmentRequired,
            boolean reportRequired,
            boolean urgent,
            Long requestedByUserId
    ) {
        this.claimNo = claimNo;
        this.order = order;
        this.orderItem = orderItem;
        this.claimType = claimType;
        this.claimStatus = claimStatus;
        this.ownerOrgType = ownerOrgType;
        this.reasonText = reasonText;
        this.customerRequest = customerRequest;
        this.approvalRequired = approvalRequired;
        this.attachmentRequired = attachmentRequired;
        this.reportRequired = reportRequired;
        this.urgent = urgent;
        this.requestedByUserId = requestedByUserId;
    }
}

