/**
 * 상태 전이 enum / 코드 표준
 * 기준: status-code-standard.md
 *
 * 프런트는 이 값을 직접 계산하거나 전이를 임의로 판단하지 않는다.
 * API 응답의 currentStatus / displayStatus / availableActions를 그대로 사용한다.
 */

// ─────────────────────────────────────────────
// OrderItem 상태
// ─────────────────────────────────────────────

export const OrderItemStatus = {
  RECEIVED: 'RECEIVED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  COLLECTION_REQUESTED: 'COLLECTION_REQUESTED',
  COLLECTED: 'COLLECTED',
  IN_TRANSIT_TO_PLANT: 'IN_TRANSIT_TO_PLANT',
  PLANT_RECEIVED: 'PLANT_RECEIVED',
  ROUTING_READY: 'ROUTING_READY',
  PROCESSING: 'PROCESSING',
  PROCESS_COMPLETED: 'PROCESS_COMPLETED',
  INSPECTION_PENDING: 'INSPECTION_PENDING',
  INSPECTION_COMPLETED: 'INSPECTION_COMPLETED',
  READY_FOR_SHIPMENT: 'READY_FOR_SHIPMENT',
  IN_TRANSIT_TO_STORE: 'IN_TRANSIT_TO_STORE',
  ARRIVED_AT_STORE: 'ARRIVED_AT_STORE',
  PICKED_UP: 'PICKED_UP',
  HOLD_FOR_CONFIRMATION: 'HOLD_FOR_CONFIRMATION',
  REGION_REVIEW: 'REGION_REVIEW',
  STORE_CONFIRM_PENDING: 'STORE_CONFIRM_PENDING',
  RETURNED_TO_STORE: 'RETURNED_TO_STORE',
  OUTSOURCING_REQUESTED: 'OUTSOURCING_REQUESTED',
  OUTSOURCING_IN_PROGRESS: 'OUTSOURCING_IN_PROGRESS',
  OUTSOURCING_COMPLETED: 'OUTSOURCING_COMPLETED',
  CLAIM_REQUESTED: 'CLAIM_REQUESTED',
  CLAIM_REVIEWING: 'CLAIM_REVIEWING',
  CLAIM_RESOLVED: 'CLAIM_RESOLVED',
  REFUND_REQUESTED: 'REFUND_REQUESTED',
  REFUND_COMPLETED: 'REFUND_COMPLETED',
  CLOSED: 'CLOSED',
  TERMINATED: 'TERMINATED',
} as const

export type OrderItemStatus = (typeof OrderItemStatus)[keyof typeof OrderItemStatus]

// ─────────────────────────────────────────────
// 결제 상태
// ─────────────────────────────────────────────

export const PaymentStatus = {
  PENDING: 'PENDING',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
} as const

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

// ─────────────────────────────────────────────
// 환불 상태
// ─────────────────────────────────────────────

export const RefundStatus = {
  REQUESTED: 'REQUESTED',
  APPROVAL_PENDING: 'APPROVAL_PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
} as const

export type RefundStatus = (typeof RefundStatus)[keyof typeof RefundStatus]

// ─────────────────────────────────────────────
// 클레임 상태
// ─────────────────────────────────────────────

export const ClaimStatus = {
  REQUESTED: 'REQUESTED',
  REVIEWING: 'REVIEWING',
  WAITING_ATTACHMENT: 'WAITING_ATTACHMENT',
  APPROVED_REWASH: 'APPROVED_REWASH',
  APPROVED_REFUND: 'APPROVED_REFUND',
  APPROVED_COMPENSATION: 'APPROVED_COMPENSATION',
  REJECTED: 'REJECTED',
  RESOLVED: 'RESOLVED',
} as const

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus]

// ─────────────────────────────────────────────
// 정산 상태
// ─────────────────────────────────────────────

export const SettlementStatus = {
  DRAFT: 'DRAFT',
  UNDER_REVIEW: 'UNDER_REVIEW',
  CONFIRMED: 'CONFIRMED',
  ADJUSTED: 'ADJUSTED',
  CANCELLED: 'CANCELLED',
} as const

export type SettlementStatus = (typeof SettlementStatus)[keyof typeof SettlementStatus]

// ─────────────────────────────────────────────
// 권한 역할
// 기준: authorization.md
// ─────────────────────────────────────────────

export const UserRole = {
  HQ_ADMIN: 'HQ_ADMIN',
  HQ_OPERATOR: 'HQ_OPERATOR',
  REGION_MANAGER: 'REGION_MANAGER',
  REGION_OPERATOR: 'REGION_OPERATOR',
  PLANT_MANAGER: 'PLANT_MANAGER',
  PLANT_OPERATOR: 'PLANT_OPERATOR',
  STORE_OWNER: 'STORE_OWNER',
  STORE_STAFF: 'STORE_STAFF',
  AUDITOR: 'AUDITOR',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  SERVICE_ACCOUNT: 'SERVICE_ACCOUNT',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// ─────────────────────────────────────────────
// 권한 Scope
// ─────────────────────────────────────────────

export const AuthScope = {
  SELF_STORE: 'SELF_STORE',
  SELF_PLANT: 'SELF_PLANT',
  SELF_REGION: 'SELF_REGION',
  MULTI_REGION: 'MULTI_REGION',
  NATIONWIDE: 'NATIONWIDE',
  EXCEPTION_SCOPE: 'EXCEPTION_SCOPE',
} as const

export type AuthScope = (typeof AuthScope)[keyof typeof AuthScope]

// ─────────────────────────────────────────────
// 워크스페이스 (조직 유형)
// ─────────────────────────────────────────────

export const Workspace = {
  STORE: 'STORE',
  PLANT: 'PLANT',
  REGION: 'REGION',
  HQ: 'HQ',
} as const

export type Workspace = (typeof Workspace)[keyof typeof Workspace]

/** 역할 → 워크스페이스 매핑 */
export const ROLE_TO_WORKSPACE: Record<UserRole, Workspace> = {
  HQ_ADMIN: Workspace.HQ,
  HQ_OPERATOR: Workspace.HQ,
  REGION_MANAGER: Workspace.REGION,
  REGION_OPERATOR: Workspace.REGION,
  PLANT_MANAGER: Workspace.PLANT,
  PLANT_OPERATOR: Workspace.PLANT,
  STORE_OWNER: Workspace.STORE,
  STORE_STAFF: Workspace.STORE,
  AUDITOR: Workspace.HQ,
  SYSTEM_ADMIN: Workspace.HQ,
  SERVICE_ACCOUNT: Workspace.HQ,
}

// ─────────────────────────────────────────────
// 정책 결정 코드
// ─────────────────────────────────────────────

export const PolicyDecision = {
  ALLOW: 'ALLOW',
  ALLOW_WITH_OBLIGATION: 'ALLOW_WITH_OBLIGATION',
  DENY: 'DENY',
} as const

export type PolicyDecision = (typeof PolicyDecision)[keyof typeof PolicyDecision]

// ─────────────────────────────────────────────
// 정산 라인 유형
// ─────────────────────────────────────────────

export const SettlementLineType = {
  REVENUE: 'REVENUE',
  REFUND: 'REFUND',
  COMPENSATION: 'COMPENSATION',
  OUTSOURCING_COST: 'OUTSOURCING_COST',
  REWASH_COST: 'REWASH_COST',
  DELIVERY_FAILURE_COST: 'DELIVERY_FAILURE_COST',
} as const

export type SettlementLineType = (typeof SettlementLineType)[keyof typeof SettlementLineType]
