import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

function AppLayout() {
  const location = useLocation()

  const hideShell =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/user-access') ||
    location.pathname.startsWith('/role-dashboard')

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-primary))]">
      {!hideShell && <AppHeader />}
      <main>
        <Outlet />
      </main>
      {!hideShell && <AppFooter />}
    </div>
  )
}

export default AppLayout
