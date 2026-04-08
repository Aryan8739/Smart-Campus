import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, UserRole } from '../../contexts/AuthContext'

const roles: { value: UserRole; label: string; icon: string }[] = [
  { value: 'customer', label: 'Student/Staff', icon: '👨‍🎓' },
  { value: 'technician', label: 'Technician', icon: '🔧' },
  { value: 'vendor', label: 'Vendor', icon: '🏢' },
  { value: 'department_admin', label: 'Department Admin', icon: '👔' },
]

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('customer')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      await register(name, email, password, role)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--color-bg))] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">🏛️</div>
          <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">
            CAMPUS360
          </h1>
          <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
            Gautam Buddha University
          </p>
        </div>

        <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
              Join the smart campus platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-2.5 text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-secondary))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20"
                placeholder="Rahul Kumar"
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-2.5 text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-secondary))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20"
                placeholder="student@gbu.ac.in"
              />
            </div>

            <div>
              <label 
                htmlFor="role" 
                className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2"
              >
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                      role === r.value
                        ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10'
                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:border-[rgb(var(--color-primary))]/50'
                    }`}
                  >
                    <span className="text-2xl mb-2">{r.icon}</span>
                    <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-2.5 text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-secondary))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-2.5 text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-secondary))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[rgb(var(--color-primary))] px-4 py-3 font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[rgb(var(--color-text-secondary))]">
              Already have an account?{' '}
            </span>
            <Link 
              to="/login" 
              className="font-semibold text-[rgb(var(--color-primary))] hover:underline"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
