import { Navigate } from 'react-router-dom'
import { useAuth, UserRole } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--color-bg))]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent"></div>
          <p className="mt-4 text-sm text-[rgb(var(--color-text-secondary))]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--color-bg))] px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
            Access Denied
          </h2>
          <p className="mt-2 text-[rgb(var(--color-text-secondary))]">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
