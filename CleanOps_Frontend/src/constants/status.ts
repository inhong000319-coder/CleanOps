/**
 * 상태 배지 표시 설정
 * 기준: status-code-standard.md, frontend-state-action-mapping.md
 *
 * displayStatus는 서버가 내려주는 값을 우선 사용한다.
 * 이 상수는 서버 응답이 없는 경우(mock, fallback)의 기본값이다.
 * 프런트가 status → label을 임의 계산해서 상태 전이를 판단하지 않는다.
 */

import type { OrderItemStatus, PaymentStatus, RefundStatus, ClaimStatus, SettlementStatus } from '../types/enums'

// ─────────────────────────────────────────────
// 배지 스타일 변형
// ─────────────────────────────────────────────

export type BadgeVariant =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'

export interface StatusBadgeConfig {
  label: string
  variant: BadgeVariant
}

// ─────────────────────────────────────────────
// OrderItem 상태 배지
// ─────────────────────────────────────────────

export const ORDER_ITEM_STATUS_BADGE: Record<OrderItemStatus, StatusBadgeConfig> = {
  RECEIVED: { label: '접수완료', variant: 'info' },
  PAYMENT_PENDING: { label: '미결제', variant: 'warning' },
  PAYMENT_COMPLETED: { label: '결제완료', variant: 'success' },
  COLLECTION_REQUESTED: { label: '수거요청', variant: 'info' },
  COLLECTED: { label: '수거완료', variant: 'info' },
  IN_TRANSIT_TO_PLANT: { label: '공장이동중', variant: 'info' },
  PLANT_RECEIVED: { label: '공장입고', variant: 'info' },
  ROUTING_READY: { label: '라우팅대기', variant: 'default' },
  PROCESSING: { label: '처리중', variant: 'info' },
  PROCESS_COMPLETED: { label: '처리완료', variant: 'success' },
  INSPECTION_PENDING: { label: '검수대기', variant: 'warning' },
  INSPECTION_COMPLETED: { label: '검수완료', variant: 'success' },
  READY_FOR_SHIPMENT: { label: '출고준비', variant: 'info' },
  IN_TRANSIT_TO_STORE: { label: '매장이동중', variant: 'info' },
  ARRIVED_AT_STORE: { label: '매장도착', variant: 'success' },
  PICKED_UP: { label: '출고완료', variant: 'success' },
  HOLD_FOR_CONFIRMATION: { label: '확인품', variant: 'warning' },
  REGION_REVIEW: { label: '지사검토중', variant: 'warning' },
  STORE_CONFIRM_PENDING: { label: '점주확인대기', variant: 'warning' },
  RETURNED_TO_STORE: { label: '회송', variant: 'muted' },
  OUTSOURCING_REQUESTED: { label: '외주요청', variant: 'info' },
  OUTSOURCING_IN_PROGRESS: { label: '외주진행중', variant: 'info' },
  OUTSOURCING_COMPLETED: { label: '외주완료', variant: 'success' },
  CLAIM_REQUESTED: { label: '클레임접수', variant: 'danger' },
  CLAIM_REVIEWING: { label: '클레임처리중', variant: 'danger' },
  CLAIM_RESOLVED: { label: '클레임종결', variant: 'muted' },
  REFUND_REQUESTED: { label: '환불처리중', variant: 'warning' },
  REFUND_COMPLETED: { label: '환불완료', variant: 'muted' },
  CLOSED: { label: '종료', variant: 'muted' },
  TERMINATED: { label: '종료', variant: 'muted' },
}

// ─────────────────────────────────────────────
// PaymentStatus 배지
// ─────────────────────────────────────────────

export const PAYMENT_STATUS_BADGE: Record<PaymentStatus, StatusBadgeConfig> = {
  PENDING: { label: '결제대기', variant: 'warning' },
  PARTIALLY_PAID: { label: '부분결제', variant: 'warning' },
  PAID: { label: '결제완료', variant: 'success' },
  FAILED: { label: '결제실패', variant: 'danger' },
  CANCELLED: { label: '취소', variant: 'muted' },
  REFUNDED: { label: '환불완료', variant: 'muted' },
  PARTIALLY_REFUNDED: { label: '부분환불', variant: 'warning' },
}

// ─────────────────────────────────────────────
// RefundStatus 배지
// ─────────────────────────────────────────────

export const REFUND_STATUS_BADGE: Record<RefundStatus, StatusBadgeConfig> = {
  REQUESTED: { label: '환불요청', variant: 'warning' },
  APPROVAL_PENDING: { label: '승인대기', variant: 'warning' },
  APPROVED: { label: '승인완료', variant: 'success' },
  REJECTED: { label: '반려', variant: 'danger' },
  COMPLETED: { label: '환불완료', variant: 'muted' },
}

// ─────────────────────────────────────────────
// ClaimStatus 배지
// ─────────────────────────────────────────────

export const CLAIM_STATUS_BADGE: Record<ClaimStatus, StatusBadgeConfig> = {
  REQUESTED: { label: '접수', variant: 'warning' },
  REVIEWING: { label: '검토중', variant: 'info' },
  WAITING_ATTACHMENT: { label: '첨부대기', variant: 'warning' },
  APPROVED_REWASH: { label: '재세탁승인', variant: 'success' },
  APPROVED_REFUND: { label: '환불승인', variant: 'success' },
  APPROVED_COMPENSATION: { label: '보상승인', variant: 'success' },
  REJECTED: { label: '기각', variant: 'muted' },
  RESOLVED: { label: '종결', variant: 'muted' },
}

// ─────────────────────────────────────────────
// SettlementStatus 배지
// ─────────────────────────────────────────────

export const SETTLEMENT_STATUS_BADGE: Record<SettlementStatus, StatusBadgeConfig> = {
  DRAFT: { label: '초안', variant: 'default' },
  UNDER_REVIEW: { label: '검토중', variant: 'info' },
  CONFIRMED: { label: '확정', variant: 'success' },
  ADJUSTED: { label: '조정됨', variant: 'warning' },
  CANCELLED: { label: '취소', variant: 'muted' },
}

// ─────────────────────────────────────────────
// CSS 클래스 매핑 (Tailwind 기반 — 필요시 교체)
// ─────────────────────────────────────────────

export const BADGE_VARIANT_CLASS: Record<BadgeVariant, string> = {
  default: 'badge badge--default',
  info: 'badge badge--info',
  success: 'badge badge--success',
  warning: 'badge badge--warning',
  danger: 'badge badge--danger',
  muted: 'badge badge--muted',
}
