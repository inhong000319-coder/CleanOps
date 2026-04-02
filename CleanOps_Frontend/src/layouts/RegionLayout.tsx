/**
 * RegionLayout — REGION 워크스페이스 레이아웃
 * 기준: requirements.md (REGION: 운영 조정, 물류 관제, 클레임 1차 처리)
 *
 * 사이드바: 운영 대시보드 / 클레임 처리
 */

import { Outlet } from 'react-router-dom'
import { SidebarNavItem } from './AppLayout'
import styles from './WorkspaceLayout.module.css'

export function RegionLayout() {
  return (
    <div className={styles.workspace}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>운영</p>
          <SidebarNavItem to="/region/dashboard" label="운영 대시보드" />
        </div>
        <div className={styles.sidebarSection}>
          <p className={styles.sectionLabel}>처리</p>
          <SidebarNavItem to="/region/claims" label="클레임 처리" />
        </div>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
