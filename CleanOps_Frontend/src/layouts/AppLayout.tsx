/**
 * AppLayout — 루트 레이아웃
 * 기준: implementation-rules.md (공통 레이아웃과 라우팅 최우선)
 *
 * 워크스페이스별 레이아웃(StoreLayout, PlantLayout 등)의 공통 골격이다.
 * 인증 컨텍스트와 워크스페이스 분기는 여기서 처리한다.
 */

import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import type { Workspace } from '../types/enums'
import { ROLE_TO_WORKSPACE } from '../types/enums'
import { useAuth } from '../hooks/useAuth'
import styles from './AppLayout.module.css'

// ─────────────────────────────────────────────
// 워크스페이스별 라벨/경로 설정
// ─────────────────────────────────────────────

const WORKSPACE_CONFIG: Record<Workspace, { label: string; rootPath: string; color: string }> = {
  STORE: { label: '매장 POS', rootPath: '/store', color: '#1e6ac7' },
  PLANT: { label: '공장 작업', rootPath: '/plant', color: '#2e7d32' },
  REGION: { label: '지역 운영', rootPath: '/region', color: '#e65100' },
  HQ: { label: '본사', rootPath: '/hq', color: '#6a1b9a' },
}

// ─────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  const workspace = ROLE_TO_WORKSPACE[user.role]
  const wsConfig = WORKSPACE_CONFIG[workspace]

  return (
    <div className={styles.root}>
      {/* 상단 글로벌 헤더 */}
      <header className={styles.header} style={{ borderBottomColor: wsConfig.color }}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>CleanOps</span>
          <span className={styles.workspaceLabel} style={{ color: wsConfig.color }}>
            {wsConfig.label}
          </span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userInfo}>
            {user.displayName} · {user.role}
          </span>
          <button type="button" className={styles.logoutBtn} onClick={logout}>
            로그아웃
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {/* 사이드바는 각 워크스페이스 레이아웃이 담당 */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 공통 사이드바 Nav 아이템 컴포넌트
// ─────────────────────────────────────────────

interface NavItemProps {
  to: string
  label: string
}

export function SidebarNavItem({ to, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [styles.navItem, isActive ? styles.navItemActive : ''].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}
