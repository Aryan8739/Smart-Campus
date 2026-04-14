import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { getDefaultRouteForRole } from '../../utils/navigation'

function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const loggedInUser = await login(email, password)
      const redirectPath =
        (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
        getDefaultRouteForRole(loggedInUser.role)

      navigate(redirectPath)
    } catch {
      setError('Invalid login ID or password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[rgb(var(--color-bg))] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--color-primary),0.14),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(var(--color-accent),0.12),transparent_40%)]" />

      <div className="relative w-full max-w-md rounded-[1.75rem] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.55)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-2.5">
          <img src="/gbuLogo.png" alt="GBU Logo" className="h-full w-full object-contain" />
        </div>
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[rgb(var(--color-primary))]">
          SMART CAMPUS PORTAL
        </p>
         <p className="mt-2 text-center text-sm text-[rgb(var(--color-text-secondary))]">
          Gautam Buddha University
        </p>
       
       

      

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-xl border border-[rgba(var(--color-danger),0.35)] bg-[rgba(var(--color-danger),0.12)] px-3 py-2 text-sm text-[rgb(var(--color-danger))]">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-[rgb(var(--color-text-primary))]">
              Login ID
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-[rgb(var(--color-text-primary))] outline-none focus:border-[rgb(var(--color-primary))]"
              placeholder="Enter your official login email"
            />
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
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[rgb(var(--color-primary))] py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-3 text-xs text-[rgb(var(--color-text-secondary))]">
          <p className="font-semibold text-[rgb(var(--color-text-primary))]">Test Credentials</p>
          <p className="mt-1">Super Admin: superadmin@gbu.ac.in / Admin@123</p>
          <p>Customer: customer@gbu.ac.in / Customer@123</p>
          <p>Vendor: vendor@gbu.ac.in / Vendor@123</p>
          <p>Department Admin: deptadmin@gbu.ac.in / Dept@123</p>
          <p>Technician: technician@gbu.ac.in / Tech@123</p>
        </div>

    

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
