import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--color-bg))] px-4">
      <div className="w-full max-w-md">
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
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

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
                className="block w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-secondary))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20"
                placeholder="student@gbu.ac.in"
              />
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
                className="block w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-secondary))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[rgb(var(--color-primary))] px-4 py-3 font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[rgb(var(--color-text-secondary))]">
              Don't have an account?{' '}
            </span>
            <Link 
              to="/register" 
              className="font-semibold text-[rgb(var(--color-primary))] hover:underline"
            >
              Register here
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

export default LoginPage
