/**
 * PlantLayout — PLANT 워크스페이스 레이아웃
 * 기준: frontend-state-action-mapping.md (PLANT 작업 큐 상태 목록)
 *
 * 사이드바: 작업 큐 / 입고 처리 / 검수
 */

import { Outlet } from 'react-router-dom'
import { SidebarNavItem } from './AppLayout'
import styles from './WorkspaceLayout.module.css'

export function PlantLayout() {
  return (
    <div className={styles.workspace}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>작업</p>
          <SidebarNavItem to="/plant/queue" label="작업 큐" />
        </div>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>처리</p>
          <SidebarNavItem to="/plant/receiving" label="입고 처리" />
          <SidebarNavItem to="/plant/inspection" label="검수" />
        </div>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
