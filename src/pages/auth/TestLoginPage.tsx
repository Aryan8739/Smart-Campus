import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Demo account credentials
    const demoEmail = 'rahul.kumar@gbu.ac.in'
    const demoPassword = 'password123'

    // Check if using demo account
    if (email === demoEmail && password === demoPassword) {
      const user = {
        id: 'demo1',
        name: 'Rahul Kumar',
        email: email,
        role: 'customer',
        department: 'Computer Science'
      }
      localStorage.setItem('campus360_user', JSON.stringify(user))
      navigate('/')
      return
    }

    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('campus360_users') || '[]')
    const foundUser = registeredUsers.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      // Store current user (without password)
      const { password: _, ...userWithoutPassword } = foundUser
      localStorage.setItem('campus360_user', JSON.stringify(userWithoutPassword))
      navigate('/')
    } else {
      setError('Invalid email or password. Try demo account: rahul.kumar@gbu.ac.in / password123')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">CAMPUS360</h1>
        <p className="text-center text-gray-600 mb-8">Gautam Buddha University</p>
        
        <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>

        {/* Demo Account Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-800 mb-2">Demo Account:</p>
          <p className="text-sm text-blue-700">Email: <span className="font-mono">rahul.kumar@gbu.ac.in</span></p>
          <p className="text-sm text-blue-700">Password: <span className="font-mono">password123</span></p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="student@gbu.ac.in"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
        
        <p className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}

export default TestLoginPage
