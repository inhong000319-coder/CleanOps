/**
 * StoreLayout — STORE 워크스페이스 레이아웃
 * 기준: implementation-rules.md (STORE 접수 POS가 프런트 최우선)
 * 기준: frontend-state-action-mapping.md (STORE 화면 구성)
 *
 * 사이드바: 접수 POS / 주문·품목 조회 / 환불 처리 / 클레임
 */

import { Outlet } from 'react-router-dom'
import { SidebarNavItem } from './AppLayout'
import styles from './WorkspaceLayout.module.css'

export function StoreLayout() {
  return (
    <div className={styles.workspace}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>접수</p>
          <SidebarNavItem to="/store/pos" label="접수 POS" />
        </div>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>조회</p>
          <SidebarNavItem to="/store/orders" label="주문 / 품목 조회" />
        </div>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>처리</p>
          <SidebarNavItem to="/store/refunds" label="환불 처리" />
          <SidebarNavItem to="/store/claims" label="클레임 접수" />
        </div>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
