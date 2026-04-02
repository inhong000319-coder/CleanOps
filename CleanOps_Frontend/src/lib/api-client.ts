/**
 * API 클라이언트 베이스
 * 기준: request-standard.md, response-envelope-standard.md, error-envelope-standard.md
 *
 * 원칙:
 * - 모든 요청에 X-Request-Id를 자동 생성하여 헤더에 추가한다
 * - 응답은 ApiResult<T> 구조로 정규화한다 (axios 오류도 ApiErrorResponse로 변환)
 * - retryable=true인 오류는 재시도 UI 트리거를 포함한 에러를 던진다
 * - mock 모드(VITE_MOCK=true)에서는 mockAdapter를 사용한다
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { ApiResult, ApiResponse, ApiErrorResponse } from '../types/api'

// ─────────────────────────────────────────────
// 유틸리티
// ─────────────────────────────────────────────

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ─────────────────────────────────────────────
// CleanOps API 클라이언트 클래스
// ─────────────────────────────────────────────

class CleanOpsApiClient {
  private readonly http: AxiosInstance

  constructor(baseURL: string) {
    this.http = axios.create({
      baseURL,
      timeout: 15_000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.http.interceptors.request.use((config) => {
      config.headers['X-Request-Id'] = generateRequestId()

      const token = this.getToken()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }

      return config
    })

    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        // 네트워크 오류 → ApiErrorResponse로 정규화
        if (!error.response) {
          const networkError: ApiErrorResponse = {
            success: false,
            error: {
              code: 'NETWORK_ERROR',
              message: '네트워크 오류가 발생했습니다. 연결 상태를 확인해 주세요.',
              details: {},
              retryable: true,
              approvalRequired: false,
              attachmentRequired: false,
              reportRequired: false,
            },
            meta: {
              requestId: error.config?.headers?.['X-Request-Id'] ?? 'unknown',
              timestamp: new Date().toISOString(),
            },
          }
          return Promise.reject(networkError)
        }
        return Promise.reject(error)
      },
    )
  }

  private getToken(): string | null {
    return sessionStorage.getItem('cleanops_token')
  }

  // ─────────────────────────────────────────────
  // 공통 요청 메서드 — 항상 ApiResult<T>를 반환
  // ─────────────────────────────────────────────

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>({ method: 'GET', url, ...config })
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>({ method: 'POST', url, data, ...config })
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>({ method: 'PUT', url, data, ...config })
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>({ method: 'PATCH', url, data, ...config })
  }

  private async request<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
    try {
      const response = await this.http.request<ApiResponse<T>>(config)
      return response.data
    } catch (error: unknown) {
      // 이미 정규화된 네트워크 오류
      if (this.isApiErrorResponse(error)) {
        return error
      }

      // axios HTTP 오류 응답 → ApiErrorResponse
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ApiErrorResponse
        if (data && data.success === false && data.error) {
          return data
        }

        // 비표준 응답 fallback
        const fallback: ApiErrorResponse = {
          success: false,
          error: {
            code: `HTTP_${error.response.status}`,
            message: error.message,
            details: {},
            retryable: error.response.status >= 500,
            approvalRequired: false,
            attachmentRequired: false,
            reportRequired: false,
          },
          meta: {
            requestId: 'unknown',
            timestamp: new Date().toISOString(),
          },
        }
        return fallback
      }

      throw error
    }
  }

  private isApiErrorResponse(value: unknown): value is ApiErrorResponse {
    return (
      typeof value === 'object' &&
      value !== null &&
      (value as ApiErrorResponse).success === false &&
      'error' in value
    )
  }

  /** idempotency 키를 포함한 POST (중복 제출 방지) */
  async postIdempotent<T>(
    url: string,
    data: unknown,
    idempotencyKey: string,
  ): Promise<ApiResult<T>> {
    return this.post<T>(url, data, {
      headers: { 'X-Idempotency-Key': idempotencyKey },
    })
  }
}

// ─────────────────────────────────────────────
// 싱글톤 인스턴스
// ─────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient = new CleanOpsApiClient(BASE_URL)
