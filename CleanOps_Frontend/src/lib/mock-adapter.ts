/**
 * Mock API Adapter
 * 기준: response-envelope-standard.md, dto-standard.md, status-code-standard.md
 *
 * 원칙:
 * - 실제 API와 동일한 ApiResult<T> 구조를 반환한다
 * - availableActions는 서버 역할을 시뮬레이션하여 상태별로 정확히 계산한다
 * - 민감 액션(세탁 후 환불 등)은 approvalRequired / attachmentRequired를 포함한다
 * - 개발/테스트 환경에서만 사용한다 (VITE_MOCK=true)
 */

import type { ApiResponse, ApiErrorResponse, ApiMeta } from '../types/api'
import type {
  CreateOrderResponse,
  OrderDetailResponse,
  OrderListItemDTO,
  RefundSummaryDTO,
  ClaimDetailDTO,
  SettlementDraftDTO,
} from '../types/dto'
import { ActionCode } from '../constants/actions'

// ─────────────────────────────────────────────
// 내부 유틸리티
// ─────────────────────────────────────────────

let _requestCounter = 0

function makeMeta(overrides?: Partial<ApiMeta>): ApiMeta {
  _requestCounter++
  return {
    requestId: `mock_req_${_requestCounter.toString().padStart(4, '0')}`,
    timestamp: new Date().toISOString(),
    ...overrides,
  }
}

function ok<T>(data: T, metaOverrides?: Partial<ApiMeta>): ApiResponse<T> {
  return { success: true, data, meta: makeMeta(metaOverrides) }
}

function err(
  code: string,
  message: string,
  options?: {
    retryable?: boolean
    approvalRequired?: boolean
    attachmentRequired?: boolean
    reportRequired?: boolean
    details?: Record<string, unknown>
  },
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details: options?.details ?? {},
      retryable: options?.retryable ?? false,
      approvalRequired: options?.approvalRequired ?? false,
      attachmentRequired: options?.attachmentRequired ?? false,
      reportRequired: options?.reportRequired ?? false,
    },
    meta: makeMeta(),
  }
}

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─────────────────────────────────────────────
// Mock 데이터
// ─────────────────────────────────────────────

const MOCK_ORDERS: OrderListItemDTO[] = [
  {
    orderId: 2001,
    orderNo: 'ST01-20260403-0001',
    customer: { customerId: 1001, name: '홍길동', phone: '010-****-1234' },
    paymentStatus: 'PAID',
    itemCount: 2,
    createdAt: '2026-04-03T09:00:00Z',
  },
  {
    orderId: 2002,
    orderNo: 'ST01-20260403-0002',
    customer: { customerId: 1002, name: '김철수', phone: '010-****-5678' },
    paymentStatus: 'PENDING',
    itemCount: 1,
    createdAt: '2026-04-03T10:30:00Z',
  },
]

// ─────────────────────────────────────────────
// Mock API 메서드
// ─────────────────────────────────────────────

export const mockAdapter = {

  /** POST /orders — 주문 생성 */
  async createOrder(): Promise<ApiResponse<CreateOrderResponse>> {
    await delay()
    return ok<CreateOrderResponse>({
      orderId: 2003,
      orderNo: 'ST01-20260403-0003',
      paymentStatus: 'PAID',
      items: [
        {
          orderItemId: 3010,
          itemName: '셔츠',
          externalTagNo: 'ST01-BC999-01',
          currentStatus: 'PAYMENT_COMPLETED',
          displayStatus: '결제완료',
          expectedFinishAt: '2026-04-05T18:00:00Z',
        },
      ],
      policy: {
        policySnapshotId: 9001,
        policyDecision: 'ALLOW',
        obligations: [],
        reasonCodes: [],
      },
    })
  },

  /** GET /orders — 주문 목록 */
  async getOrders(): Promise<ApiResponse<{ items: OrderListItemDTO[] }>> {
    await delay(200)
    return ok({ items: MOCK_ORDERS }, { totalCount: MOCK_ORDERS.length })
  },

  /** GET /orders/:id — 주문 상세 */
  async getOrderDetail(orderId: number): Promise<ApiResponse<OrderDetailResponse>> {
    await delay(200)

    if (orderId === 9999) {
      return Promise.reject(
        err('ORDER_NOT_FOUND', '주문을 찾을 수 없습니다.'),
      )
    }

    return ok<OrderDetailResponse>({
      orderId,
      orderNo: `ST01-20260403-${orderId.toString().padStart(4, '0')}`,
      customer: { customerId: 1001, name: '홍길동', phone: '010-****-1234' },
      paymentStatus: 'PAID',
      items: [
        {
          orderItemId: 3001,
          itemName: '셔츠',
          externalTagNo: 'ST01-BC123-01',
          status: {
            currentStatus: 'PROCESSING',
            displayStatus: '처리중',
            // availableActions는 서버가 계산한 결과를 시뮬레이션
            availableActions: [ActionCode.VIEW_STATUS_HISTORY],
            statusUpdatedAt: '2026-04-03T10:00:00Z',
          },
        },
        {
          orderItemId: 3002,
          itemName: '바지',
          externalTagNo: 'ST01-BC123-02',
          status: {
            currentStatus: 'PICKED_UP',
            displayStatus: '출고완료',
            availableActions: [
              ActionCode.REGISTER_CLAIM,
              ActionCode.REGISTER_REWASH,
              // 세탁 후 환불 — 이 액션이 있으면 강한 경고 UI 필수
              ActionCode.REQUEST_POST_WASH_REFUND,
              ActionCode.VIEW_STATUS_HISTORY,
            ],
            statusUpdatedAt: '2026-04-02T15:00:00Z',
          },
        },
      ],
    })
  },

  /** POST /refunds — 환불 요청 */
  async requestRefund(isPostWash: boolean): Promise<ApiResponse<RefundSummaryDTO> | ApiErrorResponse> {
    await delay(400)

    if (isPostWash) {
      // 세탁 후 환불: approval + attachment + HQ 보고 필요
      return ok<RefundSummaryDTO>({
        refundId: 4001,
        refundStatus: 'APPROVAL_PENDING',
        isPostWash: true,
        policy: {
          policySnapshotId: 9100,
          policyDecision: 'ALLOW_WITH_OBLIGATION',
          obligations: ['APPROVAL_REQUIRED', 'ATTACHMENT_REQUIRED'],
          reasonCodes: ['POST_WASH_REFUND'],
        },
        approval: {
          approvalRequired: true,
          approvalType: 'STORE_OWNER_APPROVAL',
          approvalStatus: 'PENDING',
        },
        audit: {
          auditRequired: true,
          reasonRequired: true,
          attachmentRequired: true,
          hqReportRequired: true,
        },
      })
    }

    // 세탁 전 환불: 일반 처리
    return ok<RefundSummaryDTO>({
      refundId: 4002,
      refundStatus: 'REQUESTED',
      isPostWash: false,
      policy: {
        policySnapshotId: 9101,
        policyDecision: 'ALLOW',
        obligations: [],
        reasonCodes: [],
      },
      approval: {
        approvalRequired: false,
        approvalType: '',
        approvalStatus: 'APPROVED',
      },
      audit: {
        auditRequired: false,
        reasonRequired: false,
        attachmentRequired: false,
        hqReportRequired: false,
      },
    })
  },

  /** POST /claims — 클레임 등록 */
  async createClaim(): Promise<ApiResponse<ClaimDetailDTO>> {
    await delay(400)
    return ok<ClaimDetailDTO>({
      claimId: 5001,
      claimStatus: 'REQUESTED',
      ownerOrgType: 'REGION',
      availableActions: [],
      orderId: 2001,
      orderItemId: 3002,
      claimType: 'DAMAGE',
      reasonText: '단추 파손',
      customerRequest: '환불 희망',
      attachments: [],
      approval: null,
      audit: {
        auditRequired: true,
        reasonRequired: true,
        attachmentRequired: true,
        hqReportRequired: false,
      },
    })
  },

  /** GET /settlements/:id — 정산 초안 */
  async getSettlementDraft(settlementId: number): Promise<ApiResponse<SettlementDraftDTO>> {
    await delay(300)
    return ok<SettlementDraftDTO>({
      settlementId,
      settlementPeriod: '2026-03-W5',
      status: 'DRAFT',
      cutoffAt: '2026-03-31T23:59:59Z',
      lineCount: 1320,
      totals: {
        revenue: 120_000_000,
        refund: -3_200_000,
        compensation: -800_000,
        outsourcingCost: -1_400_000,
      },
    })
  },

  /** PATCH /settlements/:id/confirm — 정산 확정 시도 (CONFIRMED 상태는 수정 불가) */
  async confirmSettlement(
    settlementId: number,
    status: string,
  ): Promise<ApiResponse<{ settlementId: number }> | ApiErrorResponse> {
    await delay(400)

    if (status === 'CONFIRMED') {
      return err(
        'SETTLEMENT_LOCKED',
        '이미 확정된 정산 회차는 수정할 수 없습니다. 보정이 필요하면 adjustment를 사용하세요.',
        { retryable: false },
      )
    }

    return ok({ settlementId })
  },
}

// ─────────────────────────────────────────────
// Mock 모드 활성화 여부
// ─────────────────────────────────────────────

export const IS_MOCK_MODE = import.meta.env.VITE_MOCK === 'true'
