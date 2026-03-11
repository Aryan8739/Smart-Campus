import { Outlet, useLocation } from 'react-router-dom'
import { useAdminFilters } from '../../hooks/useAdminFilters'
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
    title: 'Operations Monitoring',
    items: [
      { label: 'Complaint Monitoring', to: '/user-access/complaints' },
      { label: 'Vendor Overview', to: '/user-access/vendors' },
      { label: 'Technician Overview', to: '/user-access/technicians' },
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

const pageTitles: Record<string, string> = {
  '/user-access/dashboard': 'Dashboard',
  '/user-access/users': 'User Management',
  '/user-access/roles-access': 'Role & Permission Matrix',
  '/user-access/sessions': 'Sessions',
  '/user-access/complaints': 'Complaint Monitoring',
  '/user-access/vendors': 'Vendor Overview',
  '/user-access/technicians': 'Technician Overview',
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

  return (
    <main className="relative min-h-screen bg-[linear-gradient(180deg,#e9edf5_0%,#dbe3f0_48%,#d8dfec_100%)] px-4 py-6 md:px-8 md:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "url('/gbuLogo.png')",
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '520px',
        }}
      />
      <div className="mx-auto max-w-[1450px]">
        <div className="overflow-hidden rounded-[2.25rem] bg-[#edf2f8] shadow-[0_40px_90px_-45px_rgba(37,60,109,0.42)] ring-1 ring-[rgba(160,177,208,0.35)]">
          <div className="grid min-h-[920px] lg:grid-cols-[280px_1fr]">
            <aside className="relative flex flex-col justify-between bg-[linear-gradient(180deg,#35497c_0%,#253661_100%)] px-5 py-8 text-white">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/70 bg-[rgba(102,186,210,0.3)]">
                  <img src="/gbuLogo.png" alt="GBU" className="h-10 w-10 rounded-full object-cover" />
                </div>
                <p className="mt-4 text-center text-xs tracking-[0.15em] text-white/80">CAMPUS360 CONTROL CENTER</p>
                <div className="mt-8 space-y-5">
                  {sidebarGroups.map((group) => (
                    <SidebarGroup key={group.title} title={group.title} items={group.items} />
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-center gap-2 text-white/80">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                  <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
                </div>
                <p className="text-center text-xs tracking-[0.3em] text-white/70">UCC GROUP 1</p>
              </div>
            </aside>

            <div className="bg-[#edf2f8]">
              <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,#f8f9fd_0%,#edf2f8_100%)] px-8 py-9 md:px-12">
                <div className="absolute inset-y-0 right-0 w-[36%] bg-[radial-gradient(circle_at_right,rgba(91,128,196,0.12),transparent_60%)]" />
                <div className="absolute right-6 top-4 hidden h-[138px] w-[360px] overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#d7deea_0%,#b7c2d3_52%,#93a0b8_100%)] ring-1 ring-[rgba(160,177,208,0.55)] md:block">
                  <div
                    className="absolute inset-0 opacity-[0.16]"
                    style={{
                      backgroundImage: "url('/gbuLogo.png')",
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '120px',
                    }}
                  />
                  <div className="absolute inset-x-6 bottom-0 h-14 rounded-t-[1.5rem] bg-[linear-gradient(180deg,#c7d8ef_0%,#e9eef6_100%)] opacity-70" />
                  <div className="absolute bottom-7 left-8 h-10 w-24 rounded-t-[1.25rem] bg-[#7c8ea8]" />
                  <div className="absolute bottom-7 left-36 h-16 w-28 rounded-t-[1.5rem] bg-[#9eaec4]" />
                  <div className="absolute bottom-7 right-12 h-12 w-24 rounded-t-[1.25rem] bg-[#7d90ae]" />
                  <div className="absolute bottom-7 left-[148px] h-20 w-4 bg-[#7f8fa6]" />
                <div className="absolute bottom-7 left-[182px] h-20 w-4 bg-[#7f8fa6]" />
                  <div className="absolute bottom-7 left-[216px] h-20 w-4 bg-[#7f8fa6]" />
                  <div className="absolute bottom-7 left-[250px] h-20 w-4 bg-[#7f8fa6]" />
                </div>
                <AdminTopbar
                  title={pageTitles[location.pathname] ?? 'Dashboard'}
                  notifications={adminModule.notifications}
                />
              </section>

              <div className="space-y-7 p-7 md:p-10">
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
    </main>
  )
}

export default AdminShell
