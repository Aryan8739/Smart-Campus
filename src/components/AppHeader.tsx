import { type ComponentType, useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Workflow,
  X,
} from 'lucide-react'

type SimpleNavItem = {
  label: string
  to: string
}

type DropdownNavItem = {
  key: string
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  items: SimpleNavItem[]
}

const topLevelNav: SimpleNavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Documentation', to: '/docs' },
]

const dropdownNav: DropdownNavItem[] = [
  {
    key: 'operations',
    label: 'Core Operations',
    icon: Workflow,
    items: [
      { label: 'Complaint Intake', to: '/modules/complaint-intake' },
      { label: 'Assignment', to: '/modules/assignment' },
      { label: 'Technician Execution', to: '/modules/technician-execution' },
      { label: 'Notification Escalation', to: '/modules/notification-escalation' },
      { label: 'Resource Allocation Booking', to: '/modules/resource-allocation-booking' },
    ],
  },
  {
    key: 'governance',
    label: 'Governance',
    icon: ShieldCheck,
    items: [
      { label: 'User Access', to: '/modules/user-access' },
      { label: 'Inventory', to: '/modules/inventory' },
      { label: 'Billing', to: '/modules/billing' },
      { label: 'Feedback Rating', to: '/modules/feedback-rating' },
      { label: 'Analytics', to: '/modules/analytics' },
      { label: 'Audit Compliance', to: '/modules/audit-compliance' },
    ],
  },
]

function AppHeader() {
  const [isDark, setIsDark] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark

    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  useEffect(() => {
    const closeMenus = () => {
      setActiveMenu(null)
    }

    window.addEventListener('scroll', closeMenus, { passive: true })
    return () => window.removeEventListener('scroll', closeMenus)
  }, [])

  const toggleTheme = () => {
    setIsDark((previous) => {
      const next = !previous
      document.documentElement.classList.toggle('dark', next)
      window.localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  const navGlowClass = useMemo(
    () =>
      'before:pointer-events-none before:absolute before:-inset-px before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-[rgba(var(--color-primary),0.28)] before:to-[rgba(var(--color-accent),0.22)]',
    [],
  )

  const toggleMobileSubmenu = (key: string) => {
    setExpandedMobileMenus((previous) => ({ ...previous, [key]: !previous[key] }))
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]/95 backdrop-blur-md">
    

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src="/gbuLogo.png" alt="logo" className='h-16' />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold md:text-base">Smart Campus Portal</p>
            <p className="truncate text-xs text-[rgb(var(--color-text-secondary))] md:text-sm">
              Service, Governance and Campus Ops
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {topLevelNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-xl px-3 py-2 text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-[rgb(var(--color-primary))] text-white shadow-md shadow-[rgba(var(--color-primary),0.28)]'
                    : 'text-[rgb(var(--color-text-primary))] hover:bg-[rgba(var(--color-primary),0.08)]',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}

          {dropdownNav.map((group) => {
            const Icon = group.icon
            return (
              <div
                key={group.key}
                className="relative"
                onMouseLeave={() => setActiveMenu((current) => (current === group.key ? null : current))}
              >
                <button
                  type="button"
                  onClick={() => setActiveMenu((current) => (current === group.key ? null : group.key))}
                  onMouseEnter={() => setActiveMenu(group.key)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[rgb(var(--color-text-primary))] hover:bg-[rgba(var(--color-primary),0.08)]"
                  aria-expanded={activeMenu === group.key}
                >
                  <Icon size={16} />
                  {group.label}
                  {activeMenu === group.key ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {activeMenu === group.key && (
                  <div className="absolute left-0 top-full z-30 mt-2 min-w-72 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-2 shadow-2xl shadow-black/10">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          [
                            'block rounded-xl px-3 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-[rgb(var(--color-primary))] font-medium text-white'
                              : 'text-[rgb(var(--color-text-primary))] hover:bg-[rgba(var(--color-primary),0.09)]',
                          ].join(' ')
                        }
                        onClick={() => setActiveMenu(null)}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={[
              'relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-primary))] shadow-sm',
              navGlowClass,
            ].join(' ')}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileOpen((previous) => !previous)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-primary))] xl:hidden"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 pb-4 pt-3 xl:hidden md:px-8">
          <div className="space-y-2">
            {topLevelNav.map((item) => (
              <NavLink
                key={`mobile-${item.to}`}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'block rounded-xl px-3 py-2 text-sm font-semibold',
                    isActive
                      ? 'bg-[rgb(var(--color-primary))] text-white'
                      : 'bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-primary))]',
                  ].join(' ')
                }
                onClick={() => setIsMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {dropdownNav.map((group) => {
              const Icon = group.icon
              const isExpanded = Boolean(expandedMobileMenus[group.key])

              return (
                <div key={`mobile-group-${group.key}`} className="overflow-hidden rounded-xl border border-[rgb(var(--color-border))]">
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu(group.key)}
                    className="flex w-full items-center justify-between bg-[rgb(var(--color-bg))] px-3 py-2 text-sm font-semibold"
                  >
                    <span className="inline-flex items-center gap-2 text-[rgb(var(--color-text-primary))]">
                      <Icon size={15} />
                      {group.label}
                    </span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && (
                    <div className="space-y-1 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-2">
                      {group.items.map((item) => (
                        <NavLink
                          key={`mobile-item-${item.to}`}
                          to={item.to}
                          className={({ isActive }) =>
                            [
                              'block rounded-lg px-2.5 py-2 text-sm',
                              isActive
                                ? 'bg-[rgb(var(--color-primary))] text-white'
                                : 'text-[rgb(var(--color-text-primary))] hover:bg-[rgba(var(--color-primary),0.1)]',
                            ].join(' ')
                          }
                          onClick={() => setIsMobileOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}

export default AppHeader