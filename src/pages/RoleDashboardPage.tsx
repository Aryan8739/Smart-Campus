import { Navigate } from 'react-router-dom'
import UnderDevelopment from '../components/UnderDevelopment'
import { useAuth } from '../contexts/useAuth'

const roleTitleMap: Record<string, string> = {
  customer: 'Customer / Staff Dashboard',
  staff: 'Customer / Staff Dashboard',
  vendor: 'Vendor Dashboard',
  department_admin: 'Department Admin Dashboard',
  technician: 'Technician Dashboard',
  campus_admin: 'Campus Admin Dashboard',
  security_admin: 'Security Admin Dashboard',
  ops_admin: 'Operations Admin Dashboard',
}

function RoleDashboardPage() {
  const { user } = useAuth()
  const roleTitle = roleTitleMap[user?.role ?? 'customer'] ?? 'Role Dashboard'

  if (user?.role === 'customer' || user?.role === 'staff') {
    return <Navigate to="/customer/dashboard" replace />
  }

  if (user?.role === 'vendor') {
    return <Navigate to="/vendor/dashboard" replace />
  }

  if (user?.role === 'department_admin') {
    return <Navigate to="/department-admin/dashboard" replace />
  }

  if (user?.role === 'technician') {
    return <Navigate to="/technician/dashboard" replace />
  }

  return (
    <UnderDevelopment
      title={roleTitle}
      subtitle="This dashboard is being built module-by-module. Your login and permissions are active; role-specific widgets and workflows are under development."
    />
  )
}

export default RoleDashboardPage
