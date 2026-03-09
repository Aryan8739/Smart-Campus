import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import HomePage from './pages/HomePage'
import DocumentationPage from './pages/Documentation'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="docs" element={<DocumentationPage />} />
          <Route path="Docs" element={<DocumentationPage />} />
          <Route path="modules/user-access" element={<UserAccessPage />} />
          <Route path="modules/complaint-intake" element={<ComplaintIntakePage />} />
          <Route
            path="modules/customer-dashboard-advanced"
            element={<CustomerDashboardAdvancedPage />}
          />
          <Route path="modules/assignment" element={<AssignmentPage />} />
          <Route path="modules/technician-execution" element={<TechnicianExecutionPage />} />
          <Route path="modules/notification-escalation" element={<NotificationEscalationPage />} />
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
  )
}

export default App
