/**
 * 라우팅 구조
 * 기준: implementation-rules.md (프런트 구현 우선순위)
 *
 * 워크스페이스별 중첩 라우팅 구조:
 * /            → 역할 기반 자동 리다이렉트
 * /login       → 로그인
 * /store/*     → STORE 워크스페이스 (StoreLayout)
 * /plant/*     → PLANT 워크스페이스 (PlantLayout)
 * /region/*    → REGION 워크스페이스 (RegionLayout)
 * /hq/*        → HQ 워크스페이스 (HqLayout)
 */

import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppLayout } from '../layouts/AppLayout'
import { StoreLayout } from '../layouts/StoreLayout'
import { PlantLayout } from '../layouts/PlantLayout'
import { RegionLayout } from '../layouts/RegionLayout'
import { HqLayout } from '../layouts/HqLayout'

import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'

// STORE
import { StorePosPage } from '../workspaces/store/pages/StorePosPage'
import { OrderListPage } from '../workspaces/store/pages/OrderListPage'
import { OrderDetailPage } from '../workspaces/store/pages/OrderDetailPage'
import { RefundPage } from '../workspaces/store/pages/RefundPage'
import { ClaimPage } from '../workspaces/store/pages/ClaimPage'

// PLANT
import { PlantQueuePage } from '../workspaces/plant/pages/PlantQueuePage'
import { PlantReceivingPage } from '../workspaces/plant/pages/PlantReceivingPage'
import { PlantInspectionPage } from '../workspaces/plant/pages/PlantInspectionPage'

// REGION
import { RegionDashboardPage } from '../workspaces/region/pages/RegionDashboardPage'
import { RegionClaimPage } from '../workspaces/region/pages/RegionClaimPage'

// HQ
import { HqDashboardPage } from '../workspaces/hq/pages/HqDashboardPage'
import { HqSettlementPage } from '../workspaces/hq/pages/HqSettlementPage'
import { HqPoliciesPage } from '../workspaces/hq/pages/HqPoliciesPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // 루트 → /store 리다이렉트 (인증 후 역할 기반 리다이렉트는 AppLayout에서 처리)
      { index: true, element: <Navigate to="/store" replace /> },

      // ─────────────────────────────────────────────
      // STORE 워크스페이스
      // ─────────────────────────────────────────────
      {
        path: 'store',
        element: <StoreLayout />,
        children: [
          { index: true, element: <Navigate to="/store/pos" replace /> },
          { path: 'pos', element: <StorePosPage /> },
          { path: 'orders', element: <OrderListPage /> },
          // OrderItem 중심: orderId/:orderItemId 구조도 지원
          { path: 'orders/:orderId', element: <OrderDetailPage /> },
          { path: 'refunds', element: <RefundPage /> },
          { path: 'claims', element: <ClaimPage /> },
        ],
      },

      // ─────────────────────────────────────────────
      // PLANT 워크스페이스
      // ─────────────────────────────────────────────
      {
        path: 'plant',
        element: <PlantLayout />,
        children: [
          { index: true, element: <Navigate to="/plant/queue" replace /> },
          { path: 'queue', element: <PlantQueuePage /> },
          { path: 'receiving', element: <PlantReceivingPage /> },
          { path: 'inspection', element: <PlantInspectionPage /> },
        ],
      },

      // ─────────────────────────────────────────────
      // REGION 워크스페이스
      // ─────────────────────────────────────────────
      {
        path: 'region',
        element: <RegionLayout />,
        children: [
          { index: true, element: <Navigate to="/region/dashboard" replace /> },
          { path: 'dashboard', element: <RegionDashboardPage /> },
          { path: 'claims', element: <RegionClaimPage /> },
        ],
      },

      // ─────────────────────────────────────────────
      // HQ 워크스페이스
      // ─────────────────────────────────────────────
      {
        path: 'hq',
        element: <HqLayout />,
        children: [
          { index: true, element: <Navigate to="/hq/dashboard" replace /> },
          { path: 'dashboard', element: <HqDashboardPage /> },
          { path: 'settlement', element: <HqSettlementPage /> },
          { path: 'policies', element: <HqPoliciesPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
