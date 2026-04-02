/**
 * API Request DTO 타입 정의
 * 기준: request-standard.md
 *
 * 원칙:
 * - Request DTO는 화면 입력값 기준이 아닌 서버 처리 목적 기준으로 설계한다
 * - 민감 행위는 reasonCode / reasonText / attachmentIds 필드를 포함한다
 * - 오프라인/중복 제출 가능성이 있는 요청은 idempotency 키를 사용한다
 */

// ─────────────────────────────────────────────
// 주문 생성
// ─────────────────────────────────────────────

export interface CreateOrderItemInput {
  serviceType: 'GENERAL' | 'REPAIR' | 'HIGH_END' | 'REWASH'
  itemName: string
  quantity: number
  options: string[]
  notes: string | null
  photoAttachmentIds: number[]
}

export interface CreateOrderPaymentInput {
  method: 'CARD' | 'CASH' | 'POSTPAID' | 'CORPORATE'
  amount: number
  allowPostpaid: boolean
}

export interface CreateOrderRequest {
  customerId: number
  orderType: 'GENERAL' | 'REPAIR' | 'HIGH_END' | 'REWASH'
  items: CreateOrderItemInput[]
  couponCode: string | null
  payment: CreateOrderPaymentInput
}

// ─────────────────────────────────────────────
// 환불 요청
// 민감 행위: reasonCode / reasonText / attachmentIds 필수
// ─────────────────────────────────────────────

export interface RefundRequest {
  orderId: number
  orderItemIds: number[]
  refundType: 'PRE_WASH' | 'POST_WASH' | 'CANCEL'
  refundAmount: number
  reasonCode: string
  reasonText: string
  /** 세탁 후 환불 시 첨부 필수 */
  attachmentIds: number[]
}

export interface ApproveRefundRequest {
  refundId: number
  approvalNote: string | null
}

export interface RejectRefundRequest {
  refundId: number
  rejectionReason: string
}

// ─────────────────────────────────────────────
// 클레임 등록
// ─────────────────────────────────────────────

export interface CreateClaimRequest {
  orderId: number
  orderItemId: number
  claimType: 'DAMAGE' | 'LOSS' | 'QUALITY' | 'DELAY' | 'OTHER'
  reasonText: string
  customerRequest: string
  attachmentIds: number[]
  urgent: boolean
}

// ─────────────────────────────────────────────
// 정산
// ─────────────────────────────────────────────

export interface CreateSettlementDraftRequest {
  settlementPeriod: string
  cutoffAt: string
  orgId: number
}

export interface ConfirmSettlementRequest {
  settlementId: number
  /** 확정자 메모 (SoD: 초안 작성자 ≠ 확정자) */
  confirmNote: string | null
}

// ─────────────────────────────────────────────
// 목록 조회 공통
// ─────────────────────────────────────────────

export interface PaginationQuery {
  cursor?: string
  limit?: number
}

export interface OrderSearchRequest extends PaginationQuery {
  storeId?: number
  customerId?: number
  orderNo?: string
  paymentStatus?: string
  createdFrom?: string
  createdTo?: string
}

export interface OrderItemSearchRequest extends PaginationQuery {
  storeId?: number
  currentStatus?: string
  externalTagNo?: string
}
