import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { useTheme } from '../hooks/useTheme'

interface SidebarItem {
  label: string
  path: string
  icon: string
  roles?: string[]
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { label: 'My Complaints', path: '/dashboard/complaints', icon: '📋', roles: ['customer', 'staff'] },
  { label: 'My Tasks', path: '/dashboard/tasks', icon: '✓', roles: ['technician'] },
  { label: 'Team Management', path: '/dashboard/team', icon: '👥', roles: ['vendor', 'department_admin'] },
  { label: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
]

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { isDark, toggleTheme } = useTheme()

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredItems = sidebarItems.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  )

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen border-r border-[var(--border-color)] bg-[var(--card-bg)] transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-[var(--border-color)] p-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              CAMPUS360
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Smart Campus Platform
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t border-[var(--border-color)] p-4">
            <div className="mb-3 rounded-lg bg-[var(--bg-primary)] p-3">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user?.name}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--card-bg)]">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-2 text-[var(--text-primary)] hover:bg-[var(--border-color)]"
            >
              {isSidebarOpen ? '←' : '→'}
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)]"
              >
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
