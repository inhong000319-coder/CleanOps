/**
 * 인증 컨텍스트
 * 기준: authorization.md
 *
 * user 객체에는 role / scope / orgId가 포함된다.
 * 버튼 렌더링은 availableActions 기준이지만,
 * scope / orgId는 일부 UI 힌트(예: 승인 권한 없음 경고)에 사용된다.
 */

import { createContext, useState, type ReactNode } from 'react'
import type { UserRole, AuthScope } from '../types/enums'
import { ROLE_TO_WORKSPACE, type Workspace } from '../types/enums'

export interface AuthUser {
  userId: number
  displayName: string
  role: UserRole
  scope: AuthScope
  orgId: number
  workspace: Workspace
}

interface AuthContextValue {
  user: AuthUser | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // 개발 환경 mock 세션 복원
    const raw = sessionStorage.getItem('cleanops_user')
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  })

  function login(authUser: AuthUser, token: string) {
    const userWithWorkspace: AuthUser = {
      ...authUser,
      workspace: ROLE_TO_WORKSPACE[authUser.role],
    }
    setUser(userWithWorkspace)
    sessionStorage.setItem('cleanops_user', JSON.stringify(userWithWorkspace))
    sessionStorage.setItem('cleanops_token', token)
  }

  function logout() {
    setUser(null)
    sessionStorage.removeItem('cleanops_user')
    sessionStorage.removeItem('cleanops_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
