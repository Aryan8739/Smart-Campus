# UCC Group 1 - Admin Dashboard README

## Team Members
- **235UCC008** – Ashish Bharti
- **235UCC034** – Vivek Tiwari

## Project Title
Smart Campus Service & Maintenance Management System - Admin Dashboard

## Group
UCC Group 1

## Overview
This file documents the complete admin dashboard developed for the Smart Campus project. The dashboard is designed for super admin and admin-level monitoring of campus service operations such as user access, complaint flow, vendor tracking, technician management, reports, analytics, audit logs, and system controls.

The admin panel is built as a responsive React frontend with modular pages and reusable UI components. It provides a single control center for operational visibility and governance.

## Admin Dashboard Features

### 1. Dashboard Overview
- KPI cards for total users, active users, suspended users, pending approvals, and failed logins
- Complaint monitoring chart
- Analytics trend chart
- Vendor summary section
- Technician summary section

### 2. User Management
- User list and approval workflow
- Role-aware user creation and editing UI
- Approval status filters
- Security and login monitoring insights

### 3. Role and Permission Matrix
- Role management panel
- Permission matrix panel
- Role coverage tracking
- Role audit history
- Permission catalog update support

### 4. Session Monitoring
- User session visibility
- Risk-based session status handling
- Admin-oriented access monitoring

### 5. Complaint Monitoring
- Complaint listing with priority and status badges
- Complaint assignment workflow
- Vendor and technician mapping
- Feedback messages after assignment actions

### 6. Vendor Overview
- Vendor cards and table view
- Vendor filters
- Add, edit, suspend, and delete vendor flows
- Vendor detail modal
- Vendor assignment workflow
- SLA and alert-based insights

### 7. Technician Overview
- Technician cards and table view
- Technician filters
- Add, edit, suspend, and remove technician flows
- Technician detail modal
- Task assignment workflow
- Performance and workload insights

### 8. Reports
- Report listing
- Generate report modal
- Category-based report creation
- Date-range based reporting flow

### 9. Analytics
- Admin analytics snapshot
- Complaint, user, vendor, and technician scope summary
- Governance-focused quick metrics

### 10. Audit Logs and Activity Logs
- Admin-side governance visibility
- Action tracing support for compliance-oriented monitoring

### 11. Notification Center
- Notification records for admin workflows
- Severity-based visibility

### 12. System Settings
- Automation setting toggles
- Read-only and editable behavior through permissions
- Controls for suspension, lock rules, alerts, and force logout automation

## Sidebar Modules
The admin shell organizes the dashboard into these sections:

- Overview
- Access Control
- Operations Monitoring
- Insights
- Governance
- System

## Admin Routes
- `/user-access/dashboard`
- `/user-access/users`
- `/user-access/roles-access`
- `/user-access/sessions`
- `/user-access/complaints`
- `/user-access/vendors`
- `/user-access/technicians`
- `/user-access/reports`
- `/user-access/analytics`
- `/user-access/audit-logs`
- `/user-access/activity-logs`
- `/user-access/notifications`
- `/user-access/settings`

## Tech Stack
- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS v4
- ESLint

## Important Files
- `src/App.tsx` - main routing
- `src/components/layout/AdminShell.tsx` - admin dashboard shell
- `src/pages/admin/Dashboard.tsx` - dashboard home
- `src/pages/admin/UserManagement.tsx` - user management page
- `src/pages/admin/RoleMatrix.tsx` - role and permission matrix
- `src/pages/admin/ComplaintMonitoring.tsx` - complaint monitoring page
- `src/pages/admin/VendorOverview.tsx` - vendor management
- `src/pages/admin/TechnicianOverview.tsx` - technician management
- `src/pages/admin/Reports.tsx` - reports page
- `src/pages/admin/Analytics.tsx` - analytics page
- `src/pages/admin/SystemSettings.tsx` - system settings
- `src/features/userAccess` - feature exports, hooks, services, and types

## Project Structure
```text
src/
  components/
    common/
    layout/
    roles/
    users/
    vendor/
    technician/
    audit/
  features/
    userAccess/
      hooks/
      services/
      types.ts
      index.ts
  pages/
    admin/
      Dashboard.tsx
      UserManagement.tsx
      RoleMatrix.tsx
      Sessions.tsx
      ComplaintMonitoring.tsx
      VendorOverview.tsx
      TechnicianOverview.tsx
      Reports.tsx
      Analytics.tsx
      AuditLogs.tsx
      ActivityLogs.tsx
      NotificationCenter.tsx
      SystemSettings.tsx
```

## How to Run
1. Install dependencies:
   `npm install`
2. Start development server:
   `npm run dev`
3. Build production version:
   `npm run build`
4. Preview production build:
   `npm run preview`

## What This Dashboard Solves
- Centralized admin control for campus maintenance workflows
- Better complaint assignment visibility
- Stronger user and role governance
- Vendor and technician performance tracking
- Report and analytics support for decision making
- Audit and system control support for secure administration

## Summary
This UCC Group 1 admin dashboard is a complete frontend implementation of an institutional control panel for smart campus operations. It combines user governance, complaint oversight, workforce monitoring, reporting, analytics, and system administration into one unified dashboard.
