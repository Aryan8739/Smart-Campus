import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AppLayout from './layouts/AppLayout'
import TestLoginPage from './pages/auth/TestLoginPage'
import TestRegisterPage from './pages/auth/TestRegisterPage'
import HomePage from './pages/HomePage'
import DocumentationPage from './pages/Documentation'

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

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
