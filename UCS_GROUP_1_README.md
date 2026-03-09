# UCS Group 1 - Authentication + Layout System

## Team Members
- 235UCS052 – Deepanshu Kumar
- 235UCS037 – Ashish Kumar

## Completed Features ✅

### 1. Authentication Pages
- **Login Page** (`src/pages/auth/LoginPage.tsx`)
  - Email and password authentication
  - Form validation
  - Error handling
  - Loading states
  - Link to registration page

- **Register Page** (`src/pages/auth/RegisterPage.tsx`)
  - User registration with role selection
  - Password confirmation
  - Form validation
  - Support for multiple roles (Customer, Technician, Vendor, Department Admin)
  - Link to login page

### 2. Authentication Context
- **AuthContext** (`src/contexts/AuthContext.tsx`)
  - Centralized authentication state management
  - User session persistence (localStorage)
  - Login/Register/Logout functionality
  - Role-based user management
  - Loading states for async operations

### 3. Protected Routes
- **ProtectedRoute Component** (`src/components/ProtectedRoute.tsx`)
  - Route protection for authenticated users
  - Role-based access control
  - Automatic redirect to login for unauthenticated users
  - Access denied page for unauthorized roles
  - Loading state during authentication check

### 4. Layout System
- **AppLayout** (`src/layouts/AppLayout.tsx`)
  - Public layout for documentation and landing pages
  - Top navigation with theme toggle
  - Responsive design

- **DashboardLayout** (`src/layouts/DashboardLayout.tsx`)
  - Collapsible sidebar navigation
  - Role-based menu items
  - User profile section
  - Logout functionality
  - Theme toggle (Dark/Light mode)
  - Responsive mobile design

### 5. Enhanced HomePage
- **HomePage** (`src/pages/HomePage.tsx`)
  - Welcome screen with authentication status
  - Login/Register buttons for guests
  - Dashboard link for authenticated users
  - Feature highlights
  - Responsive design

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx        # Login form
│   │   └── RegisterPage.tsx     # Registration form
│   └── HomePage.tsx             # Landing page
├── layouts/
│   ├── AppLayout.tsx            # Public layout
│   └── DashboardLayout.tsx      # Protected dashboard layout
├── components/
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   └── AppHeader.tsx            # Top navigation (existing)
└── App.tsx                      # Updated routing with auth
```

## Key Features

### Authentication Flow
1. User visits the site → sees HomePage with Login/Register options
2. User registers → selects role → creates account
3. User logs in → redirected to dashboard
4. Session persists in localStorage
5. Protected routes check authentication status
6. Logout clears session and redirects to login

### Role-Based Access Control
Supported roles:
- `customer` - Customer/Staff
- `staff` - Staff members
- `technician` - Field technicians
- `vendor` - Vendor managers
- `department_admin` - Department administrators
- `campus_admin` - Campus administrators
- `super_admin` - System administrators

### Theme Support
- Dark/Light mode toggle
- Persists user preference in localStorage
- Respects system preference on first visit
- Consistent across all pages

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly navigation
- Optimized for all screen sizes

## How to Test

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Authentication Flow
1. Visit `http://localhost:5173/`
2. Click "Register" button
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Role: Customer/Staff
   - Password: password123
   - Confirm Password: password123
4. Click "Create Account"
5. You'll be redirected to the homepage (logged in)

### 3. Test Login
1. Logout from the dashboard
2. Click "Login" button
3. Enter credentials:
   - Email: test@example.com
   - Password: password123
4. Click "Sign In"

### 4. Test Protected Routes
1. Try accessing `/dashboard/modules/complaint-intake` without logging in
2. You should be redirected to `/login`
3. After login, you can access protected routes

### 5. Test Theme Toggle
1. Click the theme toggle button in the header
2. Theme should switch between light and dark
3. Refresh the page - theme preference should persist

### 6. Test Sidebar
1. Login to access dashboard
2. Click the sidebar toggle button (← / →)
3. Sidebar should collapse/expand
4. Navigation items should be visible
5. User profile should show at the bottom

## Integration with Other Groups

### For UCS Group 2 (Customer Dashboard)
- Use `useAuth()` hook to get current user
- Wrap your routes with `<ProtectedRoute allowedRoles={['customer', 'staff']}>`
- Access user data: `const { user } = useAuth()`

### For UCS Group 4 (Technician Dashboard)
- Use `<ProtectedRoute allowedRoles={['technician']}>`
- Check user role: `user.role === 'technician'`

### For UCC Groups
- Use appropriate role restrictions
- Vendor: `allowedRoles={['vendor']}`
- Admin: `allowedRoles={['department_admin', 'campus_admin', 'super_admin']}`

## Example Usage

### Using Auth Context in Components
```tsx
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please login</div>
  }
  
  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Creating Protected Routes
```tsx
<Route
  path="/my-page"
  element={
    <ProtectedRoute allowedRoles={['customer', 'staff']}>
      <MyPage />
    </ProtectedRoute>
  }
/>
```

## Next Steps for Other Groups

1. Import and use `AuthContext` in your components
2. Wrap your routes with `ProtectedRoute` if needed
3. Use `DashboardLayout` for dashboard pages
4. Use `AppLayout` for public pages
5. Follow the existing theme system (use CSS variables)

## Notes

- Authentication is currently using mock data (localStorage)
- Replace with actual API calls when backend is ready
- All passwords are stored in plain text (for demo only)
- Add proper password hashing in production
- Session management is basic - enhance with JWT tokens later

## Styling Guidelines

- Use Tailwind CSS utility classes
- Use CSS variables for colors: `rgb(var(--color-primary))`
- Support both dark and light themes
- Follow existing component patterns
- Maintain responsive design

## Git Workflow

1. Create feature branch: `git checkout -b ucs-group-1-auth`
2. Commit your changes: `git commit -m "Add authentication system"`
3. Push to develop: `git push origin develop`
4. Create Pull Request on GitHub

## Contact

For questions or issues related to authentication and layout:
- Deepanshu Kumar (235UCS052)
- Ashish Kumar (235UCS037)
