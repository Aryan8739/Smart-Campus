import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { getDefaultRouteForRole } from '../utils/navigation'

const highlights = [
  {
    title: 'Complaint Lifecycle Control',
    description: 'From ticket creation to closure, every step is tracked with ownership and timeline visibility.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 4h10a2 2 0 0 1 2 2v13l-4-2-3 2-3-2-4 2V6a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  },
  {
    title: 'Operational SLA Monitoring',
    description: 'Monitor priorities, escalation windows, and response thresholds through real-time status data.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
  },
  {
    title: 'Decision-Ready Insights',
    description: 'Trend-focused dashboards help campus teams allocate resources and prevent service bottlenecks.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19h16" />
        <path d="M7 15v-5" />
        <path d="M12 15V8" />
        <path d="M17 15v-3" />
      </svg>
    ),
  },
]

const stats = [
  { label: 'Service Requests Handled', value: '12,800+' },
  { label: 'Average Resolution Time', value: '5.4 hrs' },
  { label: 'Satisfaction Rating', value: '96%' },
]

function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const formattedRole = user?.role.replaceAll('_', ' ')

  return (
    <div className="relative overflow-hidden bg-(--hero-bg)">
      <div className="pointer-events-none absolute inset-0 bg-(--hero-accent)" />
      <div className="pointer-events-none absolute -left-14 top-16 h-40 w-40 rounded-full border border-[rgb(var(--color-border))/0.35] bg-[rgb(var(--color-primary))/0.12] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 translate-x-16 -translate-y-16 rounded-full bg-[rgb(var(--color-accent))/0.18] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
        <section className="rounded-3xl border border-[rgb(var(--color-border))/0.8] bg-[rgb(var(--color-card))/0.92] p-6 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.55)] backdrop-blur md:p-10">
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div>
              <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.2] bg-[rgb(var(--color-primary))/0.08] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">
                Campus Operations Platform
              </p>
              <h1 className="mt-5 text-3xl font-bold leading-tight text-[rgb(var(--color-text-primary))] md:text-5xl">
                Welcome to CAMPUS360
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-text-secondary))] md:text-lg">
                A unified service and infrastructure management system built for modern universities.
                Track requests, monitor teams, and keep every campus service dependable at scale.
              </p>
              <p className="mt-3 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                Gautam Buddha University
              </p>

              {isAuthenticated ? (
                <div className="mt-8 rounded-2xl border border-[rgb(var(--color-primary))/0.2] bg-[linear-gradient(145deg,rgb(var(--color-primary)/0.12),rgb(var(--color-card)/0.78))] p-5">
                  <p className="text-lg text-[rgb(var(--color-text-primary))]">
                    Welcome back, <span className="font-semibold">{user?.name}</span>
                  </p>
                  <p className="mt-1 text-sm capitalize text-[rgb(var(--color-text-secondary))]">
                    Role: {formattedRole}
                  </p>
                  <Link
                    to={getDefaultRouteForRole(user?.role ?? 'customer')}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-[rgb(var(--color-primary))] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-16px_rgba(30,58,138,0.8)] transition hover:bg-[rgb(var(--color-primary-hover))]"
                  >
                    Continue To Dashboard
                  </Link>
                </div>
              ) : (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-[rgb(var(--color-primary))] px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_-16px_rgba(30,58,138,0.85)] transition hover:bg-[rgb(var(--color-primary-hover))]"
                  >
                    Login To Portal
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))/0.82] px-7 py-3 text-sm font-semibold text-[rgb(var(--color-text-primary))] transition hover:bg-[rgb(var(--color-bg))]"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[rgb(var(--color-border))/0.9] bg-[rgb(var(--color-card))/0.78] p-5 shadow-[0_15px_40px_-32px_rgba(15,23,42,0.6)]"
                >
                  <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))] md:text-3xl">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[rgb(var(--color-text-secondary))]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))/0.94] p-6 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.6)] transition hover:-translate-y-1 hover:border-[rgb(var(--color-primary))/0.35] hover:shadow-[0_25px_40px_-24px_rgba(30,58,138,0.35)]"
            >
              <div className="inline-flex rounded-lg bg-[rgb(var(--color-primary))/0.1] p-2 text-[rgb(var(--color-primary))] transition group-hover:bg-[rgb(var(--color-primary))/0.18]">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--color-text-secondary))]">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-[rgb(var(--color-border))] bg-[linear-gradient(130deg,rgb(var(--color-primary)/0.1),rgb(var(--color-accent)/0.1))] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] md:text-2xl">
                Built for fast response, transparent accountability, and smooth campus operations.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[rgb(var(--color-text-secondary))] md:text-base">
                CAMPUS360 helps administrators, technicians, and service teams stay aligned through one coordinated workflow.
              </p>
            </div>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
              >
                Explore Portal Access
              </Link>
            )}
          </div>
        </section>
        </div>
      </div>
  )
}

export default HomePage
