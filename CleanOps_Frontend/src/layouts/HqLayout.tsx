/**
 * HqLayout — HQ 워크스페이스 레이아웃
 * 기준: requirements.md (HQ: 정책, 가격, 정산, 권한, 감사, 전사 통제)
 * 기준: settlement.md (정산 확정 후 direct update 금지)
 *
 * 사이드바: 전사 대시보드 / 정산 / 정책 관리
 */

import { Outlet } from 'react-router-dom'
import { SidebarNavItem } from './AppLayout'
import styles from './WorkspaceLayout.module.css'

export function HqLayout() {
  return (
    <div className={styles.workspace}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>통제</p>
          <SidebarNavItem to="/hq/dashboard" label="전사 대시보드" />
        </div>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>정산</p>
          {/* CONFIRMED 상태 정산에는 수정 버튼 비노출 — settlement 페이지에서 처리 */}
          <SidebarNavItem to="/hq/settlement" label="정산 관리" />
        </div>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>설정</p>
          <SidebarNavItem to="/hq/policies" label="정책 관리" />
        </div>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
