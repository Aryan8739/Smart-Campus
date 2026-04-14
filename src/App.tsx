import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AppLayout from './layouts/AppLayout'
import DocumentationPage from './pages/Documentation'
import HomePage from './pages/HomePage'
import TestLoginPage from './pages/auth/TestLoginPage'
import TestRegisterPage from './pages/auth/TestRegisterPage'
import AnalyticsPage from './pages/modules/AnalyticsPage'
import AssignmentPage from './pages/modules/AssignmentPage'
import AuditCompliancePage from './pages/modules/AuditCompliancePage'
import BillingPage from './pages/modules/BillingPage'
import ComplaintIntakePage from './pages/modules/ComplaintIntakePage'
import CustomerDashboardAdvancedPage from './pages/modules/CustomerDashboardAdvancedPage'
import FeedbackRatingPage from './pages/modules/FeedbackRatingPage'
import InventoryPage from './pages/modules/InventoryPage'
import NotificationEscalationPage from './pages/modules/NotificationEscalationPage'
import ResourceAllocationBookingPage from './pages/modules/ResourceAllocationBookingPage'
import TechnicianExecutionPage from './pages/modules/TechnicianExecutionPage'
import UserAccessPage from './pages/modules/UserAccessPage'
import {
  ActivityLogsPage,
  AnalyticsPage as UserAccessAnalyticsPage,
  AuditLogsPage,
  ComplaintMonitoringPage,
  DashboardPage,
  NotificationCenterPage,
  ReportsPage,
  RoleMatrixPage,
  SettingsPage,
  SessionsPage,
  UserManagementPage,
  TechniciansPage,
  VendorsPage,
} from './features/userAccess'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<TestLoginPage />} />
            <Route path="register" element={<TestRegisterPage />} />
            <Route path="docs" element={<DocumentationPage />} />
            <Route path="user-access" element={<UserAccessPage />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="roles-access" element={<RoleMatrixPage />} />
              <Route path="sessions" element={<SessionsPage />} />
              <Route path="complaints" element={<ComplaintMonitoringPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="technicians" element={<TechniciansPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="analytics" element={<UserAccessAnalyticsPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="activity-logs" element={<ActivityLogsPage />} />
              <Route path="notifications" element={<NotificationCenterPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
            <Route path="modules/user-access" element={<Navigate to="/user-access/dashboard" replace />} />
            <Route path="modules/complaint-intake" element={<ComplaintIntakePage />} />
            <Route
              path="modules/customer-dashboard-advanced"
              element={<CustomerDashboardAdvancedPage />}
            />
            <Route path="modules/assignment" element={<AssignmentPage />} />
            <Route path="modules/technician-execution" element={<TechnicianExecutionPage />} />
            <Route
              path="modules/notification-escalation"
              element={<NotificationEscalationPage />}
            />
            <Route path="modules/inventory" element={<InventoryPage />} />
            <Route path="modules/feedback-rating" element={<FeedbackRatingPage />} />
            <Route path="modules/analytics" element={<AnalyticsPage />} />
            <Route path="modules/audit-compliance" element={<AuditCompliancePage />} />
            <Route path="modules/billing" element={<BillingPage />} />
            <Route
              path="modules/resource-allocation-booking"
              element={<ResourceAllocationBookingPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
