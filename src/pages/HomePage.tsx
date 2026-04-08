import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { getDefaultRouteForRole } from '../utils/navigation'

function HomePage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[rgb(var(--color-text-primary))] md:text-5xl">
          Welcome to CAMPUS360
        </h1>
        <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))]">
          Smart Campus Service & Infrastructure Management System
        </p>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
          Gautam Buddha University
        </p>

        {isAuthenticated ? (
          <div className="mt-8">
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
              <p className="text-lg text-[rgb(var(--color-text-primary))]">
                Welcome back, <span className="font-semibold">{user?.name}</span>!
              </p>
              <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
                Role: {user?.role.replace('_', ' ')}
              </p>
              <Link
                to={getDefaultRouteForRole(user?.role ?? 'customer')}
                className="mt-6 inline-block rounded-lg bg-[rgb(var(--color-primary))] px-6 py-3 font-medium text-white hover:opacity-90"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="rounded-lg bg-[rgb(var(--color-primary))] px-8 py-3 font-medium text-white hover:opacity-90"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-8 py-3 font-medium text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg))]"
            >
              Register
            </Link>
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <div className="text-3xl">📋</div>
            <h3 className="mt-4 font-semibold text-[rgb(var(--color-text-primary))]">
              Complaint Management
            </h3>
            <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
              Register and track service complaints efficiently
            </p>
          </div>

          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <div className="text-3xl">⚡</div>
            <h3 className="mt-4 font-semibold text-[rgb(var(--color-text-primary))]">
              Real-time Tracking
            </h3>
            <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
              Monitor complaint status and SLA compliance
            </p>
          </div>

          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <div className="text-3xl">📊</div>
            <h3 className="mt-4 font-semibold text-[rgb(var(--color-text-primary))]">
              Analytics Dashboard
            </h3>
            <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
              Data-driven insights for better decisions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
