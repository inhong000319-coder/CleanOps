/**
 * 액션 코드 상수
 * 기준: frontend-state-action-mapping.md
 *
 * 프런트는 availableActions 배열에 이 코드가 포함되어 있을 때만 버튼을 렌더링한다.
 * availableActions에 없는 액션 버튼은 절대 노출하지 않는다.
 * 민감 액션(POST_WASH_REFUND 등)은 렌더링 시 강한 경고 UI를 추가한다.
 */

// ─────────────────────────────────────────────
// 공통 액션 코드
// ─────────────────────────────────────────────

export const ActionCode = {
  // 주문
  REGISTER_ORDER: 'REGISTER_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',
  RECALCULATE_PRICE: 'RECALCULATE_PRICE',

  // 결제
  REQUEST_PAYMENT: 'REQUEST_PAYMENT',
  APPROVE_POSTPAID: 'APPROVE_POSTPAID',
  REPRINT_RECEIPT: 'REPRINT_RECEIPT',

  // 환불
  REQUEST_REFUND: 'REQUEST_REFUND',
  /** 세탁 후 환불 — 이 코드가 있으면 강한 경고 UI 적용 필수 */
  REQUEST_POST_WASH_REFUND: 'REQUEST_POST_WASH_REFUND',
  APPROVE_REFUND: 'APPROVE_REFUND',
  REJECT_REFUND: 'REJECT_REFUND',

  // 클레임
  REGISTER_CLAIM: 'REGISTER_CLAIM',
  START_CLAIM_REVIEW: 'START_CLAIM_REVIEW',
  RESOLVE_CLAIM: 'RESOLVE_CLAIM',
  ESCALATE_CLAIM_TO_HQ: 'ESCALATE_CLAIM_TO_HQ',

  // 공장 처리
  START_PROCESSING: 'START_PROCESSING',
  COMPLETE_PROCESSING: 'COMPLETE_PROCESSING',
  MARK_INSPECTION_COMPLETED: 'MARK_INSPECTION_COMPLETED',
  REGISTER_EXCEPTION: 'REGISTER_EXCEPTION',
  HOLD_FOR_CONFIRMATION: 'HOLD_FOR_CONFIRMATION',
  REQUEST_OUTSOURCING: 'REQUEST_OUTSOURCING',

  // 물류
  SHIP_TO_STORE: 'SHIP_TO_STORE',
  PICKUP_ITEM: 'PICKUP_ITEM',
  MARK_ARRIVED_AT_STORE: 'MARK_ARRIVED_AT_STORE',

  // 출고
  DISPATCH_ITEM: 'DISPATCH_ITEM',
  PARTIAL_DISPATCH: 'PARTIAL_DISPATCH',

  // 재세탁
  REGISTER_REWASH: 'REGISTER_REWASH',

  // 상태 이력 조회 (항상 허용)
  VIEW_STATUS_HISTORY: 'VIEW_STATUS_HISTORY',

  // 관리자 전용
  FORCE_STATUS_CHANGE: 'FORCE_STATUS_CHANGE',

  // 정산
  CONFIRM_SETTLEMENT: 'CONFIRM_SETTLEMENT',
  ADD_SETTLEMENT_ADJUSTMENT: 'ADD_SETTLEMENT_ADJUSTMENT',
} as const

export type ActionCode = (typeof ActionCode)[keyof typeof ActionCode]

// ─────────────────────────────────────────────
// 민감 액션 목록 (강한 경고 UI가 필요한 액션)
// 기준: frontend-state-action-mapping.md, authorization.md
// ─────────────────────────────────────────────

/**
 * 이 목록에 포함된 액션 코드는 버튼 클릭 시
 * reason / attachment / approval 경고를 화면에서 강제한다.
 */
export const SENSITIVE_ACTIONS = new Set<ActionCode>([
  ActionCode.REQUEST_POST_WASH_REFUND,
  ActionCode.APPROVE_REFUND,
  ActionCode.RESOLVE_CLAIM,
  ActionCode.ESCALATE_CLAIM_TO_HQ,
  ActionCode.FORCE_STATUS_CHANGE,
  ActionCode.CONFIRM_SETTLEMENT,
  ActionCode.ADD_SETTLEMENT_ADJUSTMENT,
])

/** 세탁 후 환불 여부 판단 */
export function isPostWashRefundAction(actionCode: string): boolean {
  return actionCode === ActionCode.REQUEST_POST_WASH_REFUND
}

/** 민감 액션 여부 판단 */
export function isSensitiveAction(actionCode: string): boolean {
  return SENSITIVE_ACTIONS.has(actionCode as ActionCode)
}

// ─────────────────────────────────────────────
// 비노출 / 비활성 기준 상태 목록
// 기준: frontend-state-action-mapping.md
// ─────────────────────────────────────────────

/**
 * 이 상태에서는 운영 액션 버튼을 비노출한다.
 */
export const TERMINAL_STATUSES = new Set(['CLOSED', 'TERMINATED'])

/**
 * 이 상태에서는 접수취소 버튼을 비노출한다 (공장 입고 이후).
 * 버튼 비노출 여부는 availableActions에 CANCEL_ORDER가 없는 것으로 확인한다.
 * 이 상수는 UI 힌트 목적으로만 사용한다.
 */
export const POST_PLANT_STATUSES = new Set([
  'PLANT_RECEIVED',
  'ROUTING_READY',
  'PROCESSING',
  'PROCESS_COMPLETED',
  'INSPECTION_PENDING',
  'INSPECTION_COMPLETED',
  'READY_FOR_SHIPMENT',
  'IN_TRANSIT_TO_STORE',
  'ARRIVED_AT_STORE',
  'PICKED_UP',
])
