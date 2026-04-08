import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from '../components/AppHeader'

function AppLayout() {
  const location = useLocation()
  const hideHeader =
    location.pathname === '/' ||
    location.pathname.startsWith('/user-access') ||
    location.pathname.startsWith('/modules/user-access')

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {!hideHeader ? <AppHeader /> : null}
      <Outlet />
    </div>
  )
}

export default AppLayout
