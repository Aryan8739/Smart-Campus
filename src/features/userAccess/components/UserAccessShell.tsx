import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', to: '/user-access/dashboard' },
  { label: 'Complaints', to: '/user-access/complaints' },
  { label: 'Roles & Access', to: '/user-access/roles-access' },
  { label: 'Vendors', to: '/user-access/vendors' },
  { label: 'Technicians', to: '/user-access/technicians' },
  { label: 'Settings', to: '/user-access/settings' },
]

function UserAccessShell() {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

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
          <div className="grid min-h-[920px] lg:grid-cols-[146px_1fr]">
            <aside className="relative flex flex-col justify-between bg-[linear-gradient(180deg,#35497c_0%,#253661_100%)] px-5 py-8 text-white">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/70 bg-[rgba(102,186,210,0.3)]">
                  <img src="/gbuLogo.png" alt="GBU" className="h-10 w-10 rounded-full object-cover" />
                </div>
                <p className="mt-4 text-center text-xs tracking-[0.15em] text-white/80">VENDORS</p>

                <nav className="mt-10 space-y-2.5">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex w-full items-center justify-start rounded-[1rem] px-4 py-3.5 text-[1.02rem] font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-white/14 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                            : 'text-white/72 hover:translate-x-1 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="space-y-5">
                <div className="flex justify-center gap-2 text-white/80">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                  <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
                </div>
                <p className="text-center text-xs tracking-[0.3em] text-white/70">360</p>
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

                <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
                      Smart Campus Admin Dashboard
                    </p>
                    <h1 className="text-[2.35rem] font-semibold tracking-[-0.04em] text-slate-700 md:text-[3.35rem]">
                      {navItems.find((item) => location.pathname.startsWith(item.to))?.label ?? 'Dashboard'}
                    </h1>
                    <p className="mt-3 max-w-3xl text-[1.02rem] leading-8 text-slate-500">
                      Centralized monitoring of complaints, vendors, technicians, and access governance for secure university-wide operations.
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-wrap items-center justify-end gap-3">
                    <button className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-500 shadow-sm transition hover:-translate-y-0.5">
                      ◔
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsNotificationOpen((previous) => !previous)
                          setIsAdminMenuOpen(false)
                        }}
                        className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-500 shadow-sm transition hover:-translate-y-0.5"
                      >
                        🔔
                      </button>
                      {isNotificationOpen ? (
                        <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.24)]">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-800">Notifications</p>
                            <button
                              onClick={() => setIsNotificationOpen(false)}
                              className="text-xs font-medium text-slate-400"
                            >
                              Close
                            </button>
                          </div>
                          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                            Nothing to show here.
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="rounded-2xl bg-emerald-100 px-5 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                      Session: Active
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsAdminMenuOpen((previous) => !previous)
                          setIsNotificationOpen(false)
                        }}
                        className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
                      >
                        Admin
                      </button>
                      {isAdminMenuOpen ? (
                        <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.24)]">
                          <button
                            onClick={() => {
                              localStorage.removeItem('campus360_user')
                              navigate('/login')
                            }}
                            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Logout
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </section>

              <div className="space-y-7 p-7 md:p-10">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default UserAccessShell
