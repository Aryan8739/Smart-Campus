import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  Building2,
  Eye,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Wrench,
} from 'lucide-react'

const quickLinks = [
  { label: 'Platform Documentation', to: '/docs' },
  { label: 'Complaint Intake Module', to: '/modules/complaint-intake' },
  { label: 'Assignment Module', to: '/modules/assignment' },
  { label: 'Billing Module', to: '/modules/billing' },
  { label: 'Analytics Module', to: '/modules/analytics' },
]

const governanceLinks = [
  { label: 'Audit & Compliance', to: '/modules/audit-compliance' },
  { label: 'User Access Control', to: '/modules/user-access' },
  { label: 'Feedback & Rating', to: '/modules/feedback-rating' },
  { label: 'Inventory Governance', to: '/modules/inventory' },
]

function AppFooter() {
  const [visitorCount, setVisitorCount] = useState(12480)

  useEffect(() => {
    const key = 'smart-campus-visitor-count'
    const existing = Number(window.localStorage.getItem(key) ?? '12480')
    const nextCount = Number.isFinite(existing) && existing > 0 ? existing + 1 : 12481
    window.localStorage.setItem(key, String(nextCount))
    setVisitorCount(nextCount)
  }, [])

  return (
    <footer className="relative mt-16 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[rgba(var(--color-primary),0.18)] via-transparent to-[rgba(var(--color-accent),0.18)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-10 pt-12 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-1 text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
            <Wrench size={14} />
            Smart Campus Ops Platform
          </div>

          <h3 className="text-lg font-semibold">Gautam Buddha University</h3>
          <p className="text-sm leading-relaxed text-[rgb(var(--color-text-secondary))]">
            Transparent, SLA-driven and role-based service operations for complaint lifecycle,
            technician execution, billing governance and audit visibility.
          </p>

          <div className="flex items-center gap-2">
            <a
              href="#"
              aria-label="Campus website"
              className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-2 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-primary))] hover:text-white"
            >
              <Globe size={16} />
            </a>
            <a
              href="#"
              aria-label="Campus updates"
              className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-2 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-primary))] hover:text-white"
            >
              <Bell size={16} />
            </a>
            <a
              href="#"
              aria-label="Campus departments"
              className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-2 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-primary))] hover:text-white"
            >
              <Building2 size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-[rgb(var(--color-text-primary))] hover:text-[rgb(var(--color-primary))]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
            Governance
          </h4>
          <ul className="space-y-2 text-sm">
            {governanceLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-[rgb(var(--color-text-primary))] hover:text-[rgb(var(--color-primary))]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
            Contact Desk
          </h4>

          <div className="space-y-3 text-sm text-[rgb(var(--color-text-secondary))]">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[rgb(var(--color-primary))]" />
              <span>GBU Campus, Greater Noida, Uttar Pradesh, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-[rgb(var(--color-primary))]" />
              <span>+91 120 234 4200</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-[rgb(var(--color-primary))]" />
              <span>serviceops@gbu.ac.in</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
            <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
              Visitors: {visitorCount.toLocaleString('en-IN')}
            </p>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[rgb(var(--color-primary))] px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-[rgba(var(--color-primary),0.3)] transition-all hover:translate-y-[-1px] hover:bg-[rgb(var(--color-primary-hover))]"
              aria-label="Open visitor escalation dashboard"
            >
              <Eye size={14} />
              Visitor Escalation View
            </button>
          </div>
        </div>
      </div>

      <div className="relative border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-3 px-4 py-4 text-xs text-[rgb(var(--color-text-secondary))] md:grid-cols-3 md:px-8">
          <p className="text-center md:text-left">© 2026 Smart Campus Service & Maintenance Platform.</p>

          <div className="text-center text-[11px] font-medium text-[rgb(var(--color-text-primary))]">
            <span>Made completely with </span>
            <Heart size={12} className="mx-1 inline text-red-500" />
            <span> by </span>
            <span className="ml-1 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] bg-clip-text font-bold tracking-wide text-transparent">
              TECH INNOVATIONS
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 md:justify-end">
            <Link to="/privacy-policy" className="hover:text-[rgb(var(--color-primary))]">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-[rgb(var(--color-primary))]">
              Terms of Use
            </Link>
            <span>|</span>
            <Link to="/sitemap" className="hover:text-[rgb(var(--color-primary))]">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default AppFooter
