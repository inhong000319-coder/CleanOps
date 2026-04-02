/**
 * App 루트 컴포넌트
 * AuthProvider로 감싸고 RouterProvider를 렌더링한다.
 */

import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { router } from './router'

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
