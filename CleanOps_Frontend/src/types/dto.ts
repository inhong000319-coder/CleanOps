/**
 * 공통 DTO 타입 정의
 * 기준: dto-standard.md, response-envelope-standard.md
 *
 * 원칙:
 * - 리스트 DTO와 상세 DTO는 분리한다
 * - 승인/감사/정책 결과 필드를 숨기지 않는다
 * - StatusSummaryDTO는 availableActions 기준으로 버튼을 렌더링하는 데 사용된다
 */

import type {
  OrderItemStatus,
  PaymentStatus,
  RefundStatus,
  ClaimStatus,
  SettlementStatus,
  PolicyDecision,
  SettlementLineType,
  UserRole,
} from './enums'

// ─────────────────────────────────────────────
// 공통 DTO 조각
// ─────────────────────────────────────────────

export interface PolicyDecisionDTO {
  policySnapshotId: number
  policyDecision: PolicyDecision
  obligations: string[]
  reasonCodes: string[]
}

export interface ApprovalRequirementDTO {
  approvalRequired: boolean
  approvalType: string
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface AuditRequirementDTO {
  auditRequired: boolean
  reasonRequired: boolean
  attachmentRequired: boolean
  hqReportRequired: boolean
}

/**
 * 상태 요약 — 프런트 버튼 렌더링의 핵심 단위
 * availableActions는 서버가 계산해서 내려준다. 프런트는 임의로 계산하지 않는다.
 */
export interface StatusSummaryDTO {
  currentStatus: OrderItemStatus
  displayStatus: string
  availableActions: string[]
  statusUpdatedAt: string
}

export interface StatusHistoryItemDTO {
  fromStatus: OrderItemStatus | null
  toStatus: OrderItemStatus
  reasonCode: string | null
  reasonText: string | null
  changedBy: {
    userId: number
    displayName: string
  }
  changedAt: string
}

export interface AttachmentDTO {
  attachmentId: number
  fileName: string
  contentType: string
  uploadedBy: number
  uploadedAt: string
}

export interface AuditEventDTO {
  auditEventId: number
  eventType: string
  entityType: string
  entityId: number
  actorUserId: number
  actorRole: UserRole
  reasonText: string
  createdAt: string
}

// ─────────────────────────────────────────────
// 고객 DTO
// ─────────────────────────────────────────────

export interface CustomerSummaryDTO {
  customerId: number
  name: string
  /** 마스킹 적용 예: "010-****-1234" */
  phone: string
}

// ─────────────────────────────────────────────
// 주문 / 품목 DTO
// ─────────────────────────────────────────────

/** 주문 생성/목록에서 사용하는 품목 요약 */
export interface OrderItemSummaryDTO {
  orderItemId: number
  itemName: string
  externalTagNo: string
  currentStatus: OrderItemStatus
  displayStatus: string
  expectedFinishAt: string | null
}

/** 주문 상세에서 사용하는 품목 (status 중첩 구조) */
export interface OrderDetailItemDTO {
  orderItemId: number
  itemName: string
  externalTagNo: string
  status: StatusSummaryDTO
}

/** 주문 생성 응답 data */
export interface CreateOrderResponse {
  orderId: number
  orderNo: string
  paymentStatus: PaymentStatus
  items: OrderItemSummaryDTO[]
  policy: PolicyDecisionDTO
}

/** 주문 상세 응답 data */
export interface OrderDetailResponse {
  orderId: number
  orderNo: string
  customer: CustomerSummaryDTO
  paymentStatus: PaymentStatus
  items: OrderDetailItemDTO[]
}

/** 주문 목록 아이템 */
export interface OrderListItemDTO {
  orderId: number
  orderNo: string
  customer: CustomerSummaryDTO
  paymentStatus: PaymentStatus
  itemCount: number
  createdAt: string
}

// ─────────────────────────────────────────────
// 환불 DTO
// ─────────────────────────────────────────────

export interface RefundSummaryDTO {
  refundId: number
  refundStatus: RefundStatus
  /** 세탁 후 환불 여부 — true면 강한 경고 UI 적용 */
  isPostWash: boolean
  policy: PolicyDecisionDTO
  approval: ApprovalRequirementDTO
  audit: AuditRequirementDTO
}

export interface RefundDetailDTO extends RefundSummaryDTO {
  orderId: number
  orderItemIds: number[]
  refundAmount: number
  reasonCode: string
  reasonText: string
  attachments: AttachmentDTO[]
  statusHistory: StatusHistoryItemDTO[]
}

// ─────────────────────────────────────────────
// 클레임 DTO
// ─────────────────────────────────────────────

export interface ClaimSummaryDTO {
  claimId: number
  claimStatus: ClaimStatus
  ownerOrgType: 'STORE' | 'REGION' | 'HQ'
  availableActions: string[]
}

export interface ClaimDetailDTO extends ClaimSummaryDTO {
  orderId: number
  orderItemId: number
  claimType: string
  reasonText: string
  customerRequest: string
  attachments: AttachmentDTO[]
  approval: ApprovalRequirementDTO | null
  audit: AuditRequirementDTO
}

// ─────────────────────────────────────────────
// 정산 DTO
// ─────────────────────────────────────────────

export interface SettlementTotalsDTO {
  revenue: number
  refund: number
  compensation: number
  outsourcingCost: number
}

export interface SettlementDraftDTO {
  settlementId: number
  settlementPeriod: string
  status: SettlementStatus
  cutoffAt: string
  lineCount: number
  totals: SettlementTotalsDTO
}

export interface SettlementLineDTO {
  settlementLineId: number
  sourceType: 'ORDER_ITEM' | 'REFUND' | 'COMPENSATION' | 'OUTSOURCING'
  sourceId: number
  orderItemId: number | null
  lineType: SettlementLineType
  amount: number
  ownerOrgId: number
  description: string
}
