/**
 * API 공통 Envelope 타입
 * 기준: response-envelope-standard.md, error-envelope-standard.md
 *
 * 모든 API 응답은 success / data / meta 또는 success / error / meta 구조를 따른다.
 * 프런트는 error 필드의 retryable / approvalRequired / attachmentRequired / reportRequired를
 * 그대로 읽어 UI를 제어한다. 프런트가 임의로 이 값을 계산하지 않는다.
 */

// ─────────────────────────────────────────────
// 공통 Meta
// ─────────────────────────────────────────────

export interface ApiMeta {
  requestId: string
  timestamp: string
  nextCursor?: string
  totalCount?: number
}

// ─────────────────────────────────────────────
// 정상 응답 Envelope
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  success: true
  data: T
  meta: ApiMeta
}

// ─────────────────────────────────────────────
// 오류 응답 Envelope
// ─────────────────────────────────────────────

export interface ApiErrorDetail {
  /** 표준 오류 코드 (예: ORDER_ITEM_STATUS_INVALID) */
  code: string
  /** 사용자/운영자 메시지 */
  message: string
  /** 필드별 상세 오류 */
  details: Record<string, unknown>
  /** 재시도 가능 여부 → true면 재시도 UI 제공 */
  retryable: boolean
  /** 승인 필요 여부 → true면 승인 대기 UI 전환 */
  approvalRequired: boolean
  /** 첨부 필요 여부 → true면 제출 차단 및 첨부 유도 */
  attachmentRequired: boolean
  /** HQ 보고 필요 여부 → true면 경고 배너 표시 */
  reportRequired: boolean
}

export interface ApiErrorResponse {
  success: false
  error: ApiErrorDetail
  meta: ApiMeta
}

// ─────────────────────────────────────────────
// Union 타입 (fetch 결과 분기용)
// ─────────────────────────────────────────────

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse

// ─────────────────────────────────────────────
// 타입 가드
// ─────────────────────────────────────────────

export function isApiSuccess<T>(result: ApiResult<T>): result is ApiResponse<T> {
  return result.success === true
}

export function isApiError<T>(result: ApiResult<T>): result is ApiErrorResponse {
  return result.success === false
}

// ─────────────────────────────────────────────
// 공통 Request Header (HTTP 헤더로 전달)
// 기준: request-standard.md
// ─────────────────────────────────────────────

export interface ApiRequestHeaders {
  'X-Request-Id': string
  'X-Idempotency-Key'?: string
  'X-Device-Id'?: string
  'X-Client-Timestamp'?: string
  Authorization: string
}

// ─────────────────────────────────────────────
// 표준 오류 코드
// ─────────────────────────────────────────────

export const ApiErrorCode = {
  ORDER_ITEM_STATUS_INVALID: 'ORDER_ITEM_STATUS_INVALID',
  POLICY_EVALUATION_FAILED: 'POLICY_EVALUATION_FAILED',
  APPROVAL_REQUIRED: 'APPROVAL_REQUIRED',
  ATTACHMENT_REQUIRED: 'ATTACHMENT_REQUIRED',
  DUPLICATE_SCAN_EVENT: 'DUPLICATE_SCAN_EVENT',
  IDEMPOTENCY_REPLAY: 'IDEMPOTENCY_REPLAY',
  SETTLEMENT_LOCKED: 'SETTLEMENT_LOCKED',
} as const

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode]
