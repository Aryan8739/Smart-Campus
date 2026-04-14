import type { ActiveSession, AutomationSettings } from '../types'

export const sessionRecords: ActiveSession[] = [
  {
    id: 'SES-8801',
    user: ' Ashish Bharti',
    role: 'SECURITY_ADMIN',
    device: 'Windows 11 / Edge',
    location: 'GBU Campus, Greater Noida',
    campus: 'Campus',
    department: 'Plumbing Maintenance',
    risk: 'Low',
    lastSeen: '2 minutes ago',
    durationMinutes: 194,
    failedAttempts: 0,
    status: 'Online',
  },
  {
    id: 'SES-8802',
    user: 'Amit Yadav',
    role: 'OPS_ADMIN',
    device: 'Android / CAMPUS360 Mobile',
    location: 'Hostel Block C',
    campus: 'Research Park',
    department: 'Civil Works',
    risk: 'High',
    lastSeen: 'Just now',
    durationMinutes: 16,
    failedAttempts: 5,
    status: 'Force Logout Suggested',
  },
  {
    id: 'SES-8803',
    user: 'Riya Nanda',
    role: 'OPS_ADMIN',
    device: 'macOS / Chrome',
    location: 'Off-campus VPN',
    campus: 'North Campus',
    department: 'Administration',
    risk: 'Moderate',
    lastSeen: '11 minutes ago',
    durationMinutes: 72,
    failedAttempts: 2,
    status: 'Timeout Soon',
  },
]

export const automationSettings: AutomationSettings = {
  autoSuspendInactiveUsers: true,
  autoLockAfterFailedAttempts: true,
  credentialExpiryAlerts: true,
  autoForceLogoutHighRisk: true,
}
