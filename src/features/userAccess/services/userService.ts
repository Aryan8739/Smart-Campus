import type { FilterState, ManagedUser } from '../types'

export const userRecords: ManagedUser[] = [
  {
    id: 'USR-1008',
    name: 'Ananya Singh',
    email: 'ananya.singh@gbu.ac.in',
    phone: '+91 98765 11220',
    role: 'SUPER_ADMIN',
    department: 'Engineering Services',
    campus: 'Main Campus',
    status: 'Active',
    approval: 'Approved',
    mfaEnabled: true,
    lastLogin: '11 Mar 2026, 09:12 PM',
    loginAttempts: 1,
    sessionStatus: 'Online',
    createdDate: '03 Jan 2026',
    riskScore: 18,
    failedLoginsToday: 0,
    inactiveDays: 2,
    expiryDate: '31 Dec 2026',
  },
  {
    id: 'USR-1014',
    name: 'Raghav Mehta',
    email: 'raghav.mehta@vendor-campus.in',
    phone: '+91 98110 11244',
    role: 'OPS_ADMIN',
    department: 'Electrical Maintenance',
    campus: 'North Campus',
    status: 'Pending Approval',
    approval: 'Pending',
    mfaEnabled: false,
    lastLogin: 'No session yet',
    loginAttempts: 0,
    sessionStatus: 'Offline',
    createdDate: '08 Mar 2026',
    riskScore: 51,
    failedLoginsToday: 1,
    inactiveDays: 0,
    expiryDate: '31 Dec 2026',
  },
  {
    id: 'USR-1027',
    name: 'Sneha Verma',
    email: 'sneha.verma@gbu.ac.in',
    phone: '+91 98990 66771',
    role: 'SECURITY_ADMIN',
    department: 'Central Operations',
    campus: 'Main Campus',
    status: 'Active',
    approval: 'Approved',
    mfaEnabled: true,
    lastLogin: '11 Mar 2026, 08:41 PM',
    loginAttempts: 2,
    sessionStatus: 'Online',
    createdDate: '28 Dec 2025',
    riskScore: 34,
    failedLoginsToday: 1,
    inactiveDays: 1,
    expiryDate: '31 Dec 2026',
  },
  {
    id: 'USR-1036',
    name: 'Amit Yadav',
    email: 'amit.yadav@gbu.ac.in',
    phone: '+91 97000 41231',
    role: 'OPS_ADMIN',
    department: 'Civil Works',
    campus: 'Research Park',
    status: 'Suspended',
    approval: 'Rejected',
    mfaEnabled: true,
    lastLogin: '10 Mar 2026, 05:56 PM',
    loginAttempts: 6,
    sessionStatus: 'Force Logout Suggested',
    createdDate: '11 Feb 2026',
    riskScore: 82,
    failedLoginsToday: 5,
    inactiveDays: 104,
    expiryDate: '30 Nov 2026',
  },
  {
    id: 'USR-1045',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@gbu.ac.in',
    phone: '+91 98180 22011',
    role: 'SECURITY_ADMIN',
    department: 'Security Office',
    campus: 'Main Campus',
    status: 'Active',
    approval: 'Approved',
    mfaEnabled: true,
    lastLogin: '11 Mar 2026, 07:32 PM',
    loginAttempts: 1,
    sessionStatus: 'Online',
    createdDate: '20 Jan 2026',
    riskScore: 23,
    failedLoginsToday: 0,
    inactiveDays: 3,
    expiryDate: '31 Dec 2026',
  },
]

export function filterUsers(users: ManagedUser[], filters: FilterState) {
  return users.filter((user) => {
    const query = filters.search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query)
    const matchesCampus = filters.campus === 'All' || user.campus === filters.campus
    const matchesDepartment =
      filters.department === 'All' || user.department === filters.department
    const matchesRole = filters.role === 'All' || user.role === filters.role
    const matchesStatus = filters.status === 'All' || user.status === filters.status
    const matchesApproval =
      filters.approval === 'All' || user.approval === filters.approval
    return (
      matchesSearch &&
      matchesCampus &&
      matchesDepartment &&
      matchesRole &&
      matchesStatus &&
      matchesApproval
    )
  })
}
