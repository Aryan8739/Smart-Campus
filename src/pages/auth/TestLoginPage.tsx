import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { UserRole } from '../../contexts/authTypes'
import { useAuth } from '../../contexts/useAuth'
import { getDefaultRouteForRole } from '../../utils/navigation'

function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('super_admin')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const redirectPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    getDefaultRouteForRole(role)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(email, password, role)
    navigate(redirectPath)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[rgb(var(--color-bg))] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--color-primary),0.14),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(var(--color-accent),0.12),transparent_40%)]" />

      <div className="relative w-full max-w-md rounded-[1.75rem] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.55)]">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[rgb(var(--color-primary))]">
          CAMPUS360
        </p>
        <h1 className="mt-3 text-center text-3xl font-semibold text-[rgb(var(--color-text-primary))]">
          Secure Sign In
        </h1>
        <p className="mt-2 text-center text-sm text-[rgb(var(--color-text-secondary))]">
          Gautam Buddha University
        </p>
    

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[rgb(var(--color-text-primary))]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-[rgb(var(--color-text-primary))] outline-none focus:border-[rgb(var(--color-primary))]"
              placeholder="student@gbu.ac.in"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[rgb(var(--color-text-primary))]">
              Demo Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-[rgb(var(--color-text-primary))] outline-none focus:border-[rgb(var(--color-primary))]"
            >
              <option value="super_admin">Super Admin</option>
              <option value="security_admin">Security Admin</option>
              <option value="ops_admin">Ops Admin</option>
              <option value="campus_admin">Campus Admin</option>
              <option value="department_admin">Department Admin</option>
              <option value="vendor">Vendor</option>
              <option value="technician">Technician</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[rgb(var(--color-text-primary))]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-[rgb(var(--color-text-primary))] outline-none focus:border-[rgb(var(--color-primary))]"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[rgb(var(--color-primary))] py-3 font-semibold text-white hover:opacity-90"
          >
            Sign In
          </button>
        </form>

    

        <p className="mt-6 text-center text-sm text-[rgb(var(--color-text-secondary))]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[rgb(var(--color-primary))] hover:opacity-80"
          >
            Register here
          </Link>
        </p>

        <p className="mt-4 text-center">
          <Link to="/" className="text-sm text-[rgb(var(--color-text-secondary))] hover:opacity-80">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}

export default TestLoginPage
