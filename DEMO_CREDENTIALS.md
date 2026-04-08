# Demo Login Credentials

## CAMPUS360 - Smart Campus Platform
### Gautam Buddha University

---

## Quick Login - Any Credentials Work!

The system now uses a **demo authentication mode** where you can login with:

**Email:** Any email (e.g., `admin@gbu.ac.in`, `student@gbu.ac.in`)  
**Password:** Any password (e.g., `demo123`, `password`)  
**Role:** Select any role from the dropdown

---

## Available Roles

When logging in, you can select from these roles:

1. **Super Admin** - Full system access
2. **Security Admin** - Security and access control
3. **Ops Admin** - Operations management
4. **Campus Admin** - Campus-wide administration
5. **Department Admin** - Department-level management
6. **Vendor** - Vendor portal access
7. **Technician** - Technician dashboard
8. **Customer** - Student/Staff portal

---

## How to Login

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:5173/login`
3. Enter any email and password
4. Select a role from the dropdown
5. Click "Sign In"
6. You will be redirected to the appropriate dashboard for your role

---

## How to Register

1. Navigate to: `http://localhost:5173/register`
2. Fill in the form:
   - Full Name (e.g., "Rahul Kumar")
   - Email Address (e.g., "rahul.kumar@gbu.ac.in")
   - Select Role
   - Password (minimum 8 characters)
3. Click "Create Account"
4. You will be automatically logged in and redirected

---

## Example Credentials to Try

```
Email: admin@gbu.ac.in
Password: admin123
Role: Super Admin
```

```
Email: rahul.kumar@gbu.ac.in
Password: student123
Role: Customer
```

```
Email: tech@gbu.ac.in
Password: tech123
Role: Technician
```

---

## Features Working

✅ Login with any credentials (demo mode)  
✅ Register new users  
✅ Role-based routing  
✅ Session management  
✅ Protected routes  
✅ Role-specific dashboards  
✅ Modern UI with theme support  
✅ Logout functionality  

---

## Routes

- **Home:** `/`
- **Login:** `/login`
- **Register:** `/register`
- **Admin Dashboard:** `/admin/dashboard` (for admin roles)
- **User Access:** `/admin/user-access` (admin feature)
- **Documentation:** `/docs`

---

## Role-Based Navigation

After login, you'll be redirected based on your role:

- **Super Admin, Security Admin, Ops Admin, Campus Admin:** → `/admin/dashboard`
- **Department Admin:** → `/admin/user-access`
- **Vendor:** → `/vendor/dashboard`
- **Technician:** → `/technician/dashboard`
- **Customer:** → `/customer/dashboard`

---

## Testing the Complete Flow

1. **Test Login:**
   - Go to `/login`
   - Enter any email/password
   - Select a role
   - Should redirect to role-specific dashboard

2. **Test Registration:**
   - Go to `/register`
   - Create a new account
   - Should auto-login and redirect

3. **Test Different Roles:**
   - Login with different roles to see different dashboards
   - Each role has specific access and features

4. **Test Logout:**
   - Click "Logout" button
   - Should clear session and redirect to home

---

## New Features in This Version

✅ **Enhanced Authentication System**
- Role-based access control
- Improved auth context with Zustand
- Better session management

✅ **Admin Dashboard**
- User management
- Technician overview
- Vendor management
- Analytics and reports
- Audit logs
- System settings

✅ **Modern UI**
- CSS variables for theming
- Improved styling
- Better responsive design
- Professional look and feel

✅ **User Access Module**
- Complete user management
- Role and permission matrix
- Audit logging
- Approval workflows

---

## Group 1 UCS Completion Status

✅ **Authentication System** - Complete
✅ **Protected Routes** - Complete
✅ **Role-Based Access** - Complete
✅ **User Interface** - Complete
✅ **Session Management** - Complete
✅ **Admin Features** - Complete

---

## Git Push Instructions

All conflicts resolved! Ready to push:

```bash
# Check status
git status

# Your branch is ahead of origin/develop by 5 commits
# Push to GitHub (you'll need a Personal Access Token)
git push origin develop
```

**Note:** If you get authentication errors, you need to use a Personal Access Token instead of password. See GitHub documentation for creating tokens.

---

**Last Updated:** April 8, 2026  
**Status:** ✅ All conflicts resolved, ready to push!
