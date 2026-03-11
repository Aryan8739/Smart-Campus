import type { AuditLog, NotificationRecord, ReportRecord } from '../types'

export const auditRecords: AuditLog[] = [
  {
    id: 'AUD-4411',
    actor: 'Super Admin',
    action: 'Published updated Department Admin role policy',
    target: 'ROLE-02',
    channel: 'Role Matrix',
    module: 'Access Control',
    timestamp: '11 Mar 2026, 09:08 PM',
    outcome: 'Warning',
  },
  {
    id: 'AUD-4412',
    actor: 'System Policy Engine',
    action: 'Suspended inactive contractor account after 90 days',
    target: 'USR-0952',
    channel: 'Lifecycle Automation',
    module: 'User Management',
    timestamp: '11 Mar 2026, 08:34 PM',
    outcome: 'Success',
  },
  {
    id: 'AUD-4413',
    actor: 'Security Monitor',
    action: 'Blocked high-risk login attempt and invalid token replay',
    target: 'USR-1036',
    channel: 'Access Gateway',
    module: 'Sessions',
    timestamp: '11 Mar 2026, 08:12 PM',
    outcome: 'Blocked',
  },
  {
    id: 'ACT-9001',
    actor: 'Ops Admin',
    action: 'Reviewed vendor complaint escalation',
    target: 'CMP-2032',
    channel: 'Dashboard',
    module: 'Operations',
    timestamp: '11 Mar 2026, 07:40 PM',
    outcome: 'Success',
  },
]

export const reportRecords: ReportRecord[] = [
  { id: 'REP-1', name: 'Weekly Access Summary', category: 'Security', generatedOn: '11 Mar 2026', owner: 'Security Admin' },
  { id: 'REP-2', name: 'Campus Operations Scorecard', category: 'Operations', generatedOn: '10 Mar 2026', owner: 'Ops Admin' },
  { id: 'REP-3', name: 'Compliance Evidence Pack', category: 'Compliance', generatedOn: '09 Mar 2026', owner: 'Super Admin' },
]

export const notificationRecords: NotificationRecord[] = [
  {
    id: 'NOT-1',
    title: 'Credential Expiry Alert',
    message: '12 admin accounts require password rotation within 7 days.',
    read: false,
    createdAt: '11 Mar 2026, 08:45 PM',
    severity: 'warning',
  },
  {
    id: 'NOT-2',
    title: 'Audit Export Ready',
    message: 'Compliance bundle for March week 2 is ready for download.',
    read: true,
    createdAt: '11 Mar 2026, 06:15 PM',
    severity: 'info',
  },
]
