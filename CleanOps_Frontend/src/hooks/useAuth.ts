/**
 * 인증 컨텍스트 훅
 * 기준: authorization.md (RBAC + Scope + State + Approval + Audit)
 *
 * user.role → ROLE_TO_WORKSPACE로 워크스페이스를 결정한다.
 * 이 훅이 null을 반환하면 AppLayout에서 /login으로 리다이렉트한다.
 */

import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
