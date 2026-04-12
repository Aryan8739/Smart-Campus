import type { ComponentType } from 'react'
import {
  Bell,
  ClipboardCheck,
  Gauge,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserCircle2,
  Users,
} from 'lucide-react'
import type { VendorDashboardTab } from './types'

type VendorSidebarProps = {
  activeTab: VendorDashboardTab
  onTabChange: (tab: VendorDashboardTab) => void
  counters: {
    tickets: number
    pending: number
    unread: number
    settlements: number
  }
  userInfo: {
    name: string
    company: string
  }
  onProfileClick: () => void
  onLogout: () => void
}

const menu: Array<{
  tab: VendorDashboardTab
  title: string
  subtitle: string
  icon: ComponentType<{ className?: string }>
}> = [
  { tab: 'overview', title: 'Overview', subtitle: 'Control center', icon: LayoutDashboard },
  { tab: 'assignments', title: 'Assignments', subtitle: 'Ticket allocation', icon: ClipboardCheck },
  { tab: 'technicians', title: 'Technicians', subtitle: 'Roster and workloads', icon: Users },
  { tab: 'sla', title: 'SLA Monitor', subtitle: 'Breach risk radar', icon: Gauge },
  { tab: 'settlements', title: 'Settlements', subtitle: 'Invoice and payouts', icon: ShieldCheck },
  { tab: 'notifications', title: 'Notifications', subtitle: 'Alerts and actions', icon: Bell },
  { tab: 'profile', title: 'Vendor Profile', subtitle: 'Account preferences', icon: UserCircle2 },
]

function VendorSidebar({
  activeTab,
  onTabChange,
  counters,
  userInfo,
  onProfileClick,
  onLogout,
}: VendorSidebarProps) {
  return (
    <aside className="flex min-h-screen flex-col rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.75)] lg:sticky lg:top-4 lg:min-h-0 lg:h-[calc(100vh-2rem)] lg:overflow-hidden">
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[linear-gradient(145deg,rgb(var(--color-primary)/0.14),rgb(var(--color-card)/0.96))] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
          Vendor Operations Hub
        </p>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Assignment & SLA Management
        </p>
      </div>

      

      <nav className="mt-4 space-y-1.5">
        {menu.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.tab
          const extraCount =
            item.tab === 'notifications'
              ? counters.unread
              : item.tab === 'settlements'
                ? counters.settlements
                : null

          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onTabChange(item.tab)}
              className={[
                'group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition',
                isActive
                  ? 'border-[rgb(var(--color-primary))/0.5] bg-[rgb(var(--color-primary))/0.11]'
                  : 'border-transparent hover:border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg))]',
              ].join(' ')}
            >
              <span
                className={[
                  'rounded-xl p-2 transition',
                  isActive
                    ? 'bg-[rgb(var(--color-primary))/0.2] text-[rgb(var(--color-primary))]'
                    : 'bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-primary))]',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</span>
                <span className="block text-xs text-[rgb(var(--color-text-secondary))]">{item.subtitle}</span>
              </span>
              {extraCount !== null ? (
                <span className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--color-text-secondary))]">
                  {extraCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
          <button
            type="button"
            onClick={onProfileClick}
            className="group flex min-w-0 items-center gap-2 rounded-xl px-1 py-1 text-left transition hover:bg-[rgb(var(--color-card))]"
          >
            <div className="rounded-full border border-indigo-100 bg-indigo-50 p-2.5">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[rgb(var(--color-text-primary))]">{userInfo.name}</span>
              <span className="block truncate text-[11px] text-[rgb(var(--color-text-secondary))]">{userInfo.company}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="group rounded-full border border-slate-200 p-2.5 transition-colors hover:bg-rose-600"
            title="Logout"
          >
            <LogOut className="h-4 w-4 text-slate-500 group-hover:text-white" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default VendorSidebar
