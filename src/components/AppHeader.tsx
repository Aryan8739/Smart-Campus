import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Docs', to: '/docs' },
  { label: 'User Access', to: '/modules/user-access' },
  { label: 'Complaint Intake', to: '/modules/complaint-intake' },
  { label: 'Customer Dashboard Advanced', to: '/modules/customer-dashboard-advanced' },
  { label: 'Assignment', to: '/modules/assignment' },
  { label: 'Technician Execution', to: '/modules/technician-execution' },
  { label: 'Notification Escalation', to: '/modules/notification-escalation' },
  { label: 'Inventory', to: '/modules/inventory' },
  { label: 'Feedback Rating', to: '/modules/feedback-rating' },
  { label: 'Analytics', to: '/modules/analytics' },
  { label: 'Audit Compliance', to: '/modules/audit-compliance' },
  { label: 'Billing', to: '/modules/billing' },
  { label: 'Resource Allocation Booking', to: '/modules/resource-allocation-booking' },
]

function AppHeader() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark

    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  const toggleTheme = () => {
    setIsDark((previous) => {
      const next = !previous
      document.documentElement.classList.toggle('dark', next)
      window.localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold md:text-lg">Smart Campus Platform</h1>
            <span className="text-xs text-[rgb(var(--color-text-secondary))] md:text-sm">
              Gautam Buddha University
            </span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-1.5 text-xs font-semibold text-[rgb(var(--color-text-primary))] md:px-4 md:py-2 md:text-sm"
          >
            {isDark ? 'Light Theme' : 'Dark Theme'}
          </button>
        </div>

        <nav className="flex flex-wrap gap-2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-lg border px-3 py-1.5 text-xs font-medium md:text-sm',
                  isActive
                    ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] text-white shadow-sm'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg))]',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default AppHeader
