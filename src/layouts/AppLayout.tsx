import { Outlet } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

function AppLayout() {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-primary))]">
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

export default AppLayout
