/**
 * 로그인 페이지
 * 개발 환경에서는 역할을 선택하여 mock 로그인한다.
 */

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { AuthUser } from '../contexts/AuthContext'
import type { UserRole } from '../types/enums'
import { ROLE_TO_WORKSPACE } from '../types/enums'

const MOCK_USERS: AuthUser[] = [
  { userId: 1, displayName: '매장직원', role: 'STORE_STAFF', scope: 'SELF_STORE', orgId: 10, workspace: 'STORE' },
  { userId: 2, displayName: '점주', role: 'STORE_OWNER', scope: 'SELF_STORE', orgId: 10, workspace: 'STORE' },
  { userId: 3, displayName: '공장관리자', role: 'PLANT_MANAGER', scope: 'SELF_PLANT', orgId: 20, workspace: 'PLANT' },
  { userId: 4, displayName: '지역운영자', role: 'REGION_OPERATOR', scope: 'SELF_REGION', orgId: 30, workspace: 'REGION' },
  { userId: 5, displayName: 'HQ운영자', role: 'HQ_OPERATOR', scope: 'NATIONWIDE', orgId: 1, workspace: 'HQ' },
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleMockLogin(role: UserRole) {
    const user = MOCK_USERS.find((u) => u.role === role)
    if (!user) return
    const workspace = ROLE_TO_WORKSPACE[role]
    login({ ...user, workspace }, 'mock_token_dev')
    navigate(`/${workspace.toLowerCase()}`, { replace: true })
  }

  return (
    <div style={{ padding: 48, maxWidth: 400, margin: '80px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>CleanOps</h1>
      <p style={{ color: '#777', marginBottom: 32, fontSize: 14 }}>개발 환경 — 역할을 선택하세요</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOCK_USERS.map((u) => (
          <button
            key={u.role}
            type="button"
            onClick={() => handleMockLogin(u.role)}
            style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', background: '#f8f8f8', cursor: 'pointer', textAlign: 'left', fontSize: 14 }}
          >
            <strong>{u.displayName}</strong>
            <span style={{ color: '#999', marginLeft: 8 }}>{u.role}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
