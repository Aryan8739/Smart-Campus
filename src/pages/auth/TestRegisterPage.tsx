import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { UserRole } from '../../contexts/authTypes'
import { useAuth } from '../../contexts/useAuth'

function TestRegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('super_admin')
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await register(name, email, password, role)
    navigate(role === 'super_admin' ? '/modules/user-access' : '/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--color-bg))] px-4 py-12">
      <div className="w-full max-w-md rounded-[1.75rem] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.55)]">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[rgb(var(--color-primary))]">
          CAMPUS360
        </p>
        <h1 className="mt-3 text-center text-3xl font-semibold text-[rgb(var(--color-text-primary))]">
          Create Secure Account
        </h1>
        <p className="mt-2 text-center text-sm text-[rgb(var(--color-text-secondary))]">
          Gautam Buddha University
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[rgb(var(--color-text-primary))]">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-[rgb(var(--color-text-primary))] outline-none focus:border-[rgb(var(--color-primary))]"
              placeholder="Rahul Kumar"
            />
          </div>

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
              Select Role
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
              <option value="customer">Student/Staff</option>
              <option value="technician">Technician</option>
              <option value="vendor">Vendor</option>
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
              placeholder="Minimum 8 chars with special character"
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[rgb(var(--color-primary))] py-3 font-semibold text-white hover:opacity-90"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[rgb(var(--color-text-secondary))]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[rgb(var(--color-primary))] hover:opacity-80"
          >
            Sign in
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

export default TestRegisterPage
