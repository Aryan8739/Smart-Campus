import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AppLayout from './layouts/AppLayout'
import TestLoginPage from './pages/auth/TestLoginPage'
import TestRegisterPage from './pages/auth/TestRegisterPage'
import HomePage from './pages/HomePage'
import DocumentationPage from './pages/Documentation'

// Simple Dashboard Page (without complex layout)
function SimpleDashboard() {
  // Get user from localStorage
  const userStr = localStorage.getItem('campus360_user')
  const user = userStr ? JSON.parse(userStr) : null

  if (!user) {
    window.location.href = '/login'
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem('campus360_user')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">CAMPUS360</h1>
            <p className="text-sm text-gray-600">Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-600">
            Role: {user.role.replace('_', ' ')} | Department: {user.department}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">My Complaints</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-500 mt-1">Active complaints</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-500 mt-1">Completed tasks</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting action</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            🎉 Dashboard is Working!
          </h3>
          <p className="text-green-700 mb-4">
            You have successfully logged in and accessed the protected dashboard.
            This area is only visible to authenticated users.
          </p>
          <div className="space-y-2 text-sm text-green-700">
            <p>✅ Login system working</p>
            <p>✅ Session management working</p>
            <p>✅ Protected routes working</p>
            <p>✅ User data displaying correctly</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                📝 Create New Complaint
              </button>
              <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                📊 View Reports
              </button>
              <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                ⚙️ Settings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Profile</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Role:</span> {user.role}</p>
              <p><span className="font-medium">Department:</span> {user.department}</p>
              <p><span className="font-medium">User ID:</span> {user.id}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<TestLoginPage />} />
          <Route path="/register" element={<TestRegisterPage />} />

          {/* Public Documentation Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="docs" element={<DocumentationPage />} />
          </Route>

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<SimpleDashboard />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
