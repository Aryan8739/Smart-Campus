import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAdminFilters } from '../../features/userAccess/hooks/useAdminFilters'
import AdminTopbar from './AdminTopbar'
import GlobalFiltersBar from './GlobalFiltersBar'
import SidebarGroup from './SidebarGroup'

const sidebarGroups = [
  { title: 'Overview', items: [{ label: 'Dashboard', to: '/user-access/dashboard' }] },
  {
    title: 'Access Control',
    items: [
      { label: 'User Management', to: '/user-access/users' },
      { label: 'Role & Permission Matrix', to: '/user-access/roles-access' },
      { label: 'Sessions', to: '/user-access/sessions' },
    ],
  },
  {
    title: 'Operations Management',
    items: [
      { label: 'Complaint Management', to: '/user-access/complaints' },
      { label: 'Vendor Management', to: '/user-access/vendors' },
      { label: 'Technician Management', to: '/user-access/technicians' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Reports', to: '/user-access/reports' },
      { label: 'Analytics', to: '/user-access/analytics' },
    ],
  },
  {
    title: 'Governance',
    items: [
      { label: 'Audit Logs', to: '/user-access/audit-logs' },
      { label: 'Activity Logs', to: '/user-access/activity-logs' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Notification Center', to: '/user-access/notifications' },
      { label: 'System Settings', to: '/user-access/settings' },
    ],
  },
]

function resolveGroupTitle(pathname: string) {
  return (
    sidebarGroups.find((group) => group.items.some((item) => item.to === pathname))?.title
    ?? sidebarGroups[0].title
  )
}

function AdminSidebar({ activeGroupTitle }: { activeGroupTitle: string }) {
  const [openGroupTitle, setOpenGroupTitle] = useState(activeGroupTitle)

  return (
    <aside className="relative flex h-full flex-col justify-between overflow-y-auto border-r border-[var(--border-color)] bg-[var(--sidebar-panel-bg)] px-4 py-6 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/90 bg-[rgba(241,245,249,0.95)] shadow-sm dark:border-white/10 dark:bg-slate-800">
          <img src="/gbuLogo.png" alt="GBU" className="h-9 w-9 rounded-full object-cover" />
        </div>
        <p className="mt-3 text-center text-[11px] tracking-[0.14em] text-slate-600 dark:text-slate-300">SUPER ADMIN DASHBOARD</p>
        <div className="mt-6 space-y-4">
          {sidebarGroups.map((group) => (
            <SidebarGroup
              key={group.title}
              title={group.title}
              items={group.items}
              isOpen={openGroupTitle === group.title}
              onToggle={() => setOpenGroupTitle((current) => (current === group.title ? '' : group.title))}
              onItemSelect={() => setOpenGroupTitle(group.title)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
          <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
          <span className="h-2 w-2 rounded-full border border-slate-400 dark:border-slate-500" />
        </div>
        <p className="text-center text-[11px] tracking-[0.26em] text-slate-500 dark:text-slate-400">UCC GROUP 1</p>
      </div>
    </aside>
  )
}

const pageTitles: Record<string, string> = {
  '/user-access/dashboard': 'Dashboard',
  '/user-access/users': 'User Management',
  '/user-access/roles-access': 'Role & Permission Matrix',
  '/user-access/sessions': 'Sessions',
  '/user-access/complaints': 'Complaint Management',
  '/user-access/vendors': 'Vendor Management',
  '/user-access/technicians': 'Technician Management',
  '/user-access/reports': 'Reports',
  '/user-access/analytics': 'Analytics',
  '/user-access/audit-logs': 'Audit Logs',
  '/user-access/activity-logs': 'Activity Logs',
  '/user-access/notifications': 'Notification Center',
  '/user-access/settings': 'System Settings',
}

function AdminShell() {
  const adminModule = useAdminFilters()
  const location = useLocation()
  const activeGroupTitle = resolveGroupTitle(location.pathname)

  return (
    <main className="relative h-screen overflow-hidden bg-[var(--bg-primary)] px-2 py-3 md:px-4 md:py-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.04]"
        style={{
          backgroundImage: "url('/gbuLogo.png')",
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '520px',
        }}
      />
      <div className="mx-auto flex h-full w-full max-w-[1800px]">
        <div className="flex h-full w-full overflow-hidden rounded-[1.9rem] bg-[var(--card-bg)] shadow-[0_34px_80px_-48px_rgba(37,60,109,0.22)] ring-1 ring-[var(--border-color)] dark:bg-slate-950/85 dark:shadow-[0_34px_80px_-48px_rgba(2,6,23,0.85)]">
          <div className="grid h-full w-full lg:grid-cols-[248px_1fr]">
            <AdminSidebar key={activeGroupTitle} activeGroupTitle={activeGroupTitle} />

            <div className="flex min-h-0 min-w-0 flex-col bg-[var(--bg-primary)]">
              <section className="relative flex-none overflow-hidden border-b border-[var(--border-color)] bg-[var(--topbar-bg)] px-5 py-6 md:px-9">
                <div className="absolute inset-y-0 right-0 w-[36%] bg-[radial-gradient(circle_at_right,rgba(96,165,250,0.10),transparent_60%)] dark:bg-[radial-gradient(circle_at_right,rgba(59,130,246,0.14),transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,249,255,0.9)_62%,rgba(229,238,251,0.55)_100%)] dark:hidden" />
                {/* <div className="absolute right-5 top-4 hidden h-[118px] w-[300px] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fc_52%,#dde8f8_100%)] ring-1 ring-[rgba(160,177,208,0.32)] shadow-[0_18px_40px_-28px_rgba(59,92,143,0.20)] dark:bg-[linear-gradient(180deg,#16223d_0%,#0f1a2f_52%,#0b1426_100%)] dark:ring-slate-700 dark:shadow-none xl:block">
                  <div
                    className="absolute inset-0 opacity-[0.16] dark:opacity-[0.1]"
                    style={{
                      backgroundImage: "url('/gbuLogo.png')",
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '120px',
                    }}
                  />
                  <div className="absolute inset-x-5 bottom-0 h-12 rounded-t-[1.2rem] bg-[linear-gradient(180deg,#edf4fd_0%,#ffffff_100%)] opacity-95 dark:bg-[linear-gradient(180deg,#24324d_0%,#15223a_100%)]" />
                  <div className="absolute bottom-6 left-7 h-8 w-20 rounded-t-[1rem] bg-[#9db4d6] dark:bg-[#3f557c]" />
                  <div className="absolute bottom-6 left-28 h-14 w-24 rounded-t-[1.2rem] bg-[#bfd0e8] dark:bg-[#546989]" />
                  <div className="absolute bottom-6 right-10 h-10 w-20 rounded-t-[1rem] bg-[#a9c0df] dark:bg-[#425776]" />
                  <div className="absolute bottom-6 left-[124px] h-18 w-3 bg-[#97afce] dark:bg-[#4a5d79]" />
                  <div className="absolute bottom-6 left-[152px] h-18 w-3 bg-[#97afce] dark:bg-[#4a5d79]" />
                  <div className="absolute bottom-6 left-[180px] h-18 w-3 bg-[#97afce] dark:bg-[#4a5d79]" />
                  <div className="absolute bottom-6 left-[208px] h-18 w-3 bg-[#97afce] dark:bg-[#4a5d79]" />
                </div> */}
                <AdminTopbar
                  title={pageTitles[location.pathname] ?? 'Dashboard'}
                  notifications={adminModule.notifications}
                />
              </section>

              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-5 md:p-7">
                <div className="space-y-5">
                <GlobalFiltersBar
                  filters={adminModule.filters}
                  setFilters={adminModule.setFilters}
                  users={adminModule.users}
                />
                <Outlet context={adminModule} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AdminShell
