import { useMemo, useState } from 'react'
import { auditRecords, notificationRecords, reportRecords } from '../services/auditService'
import { sessionRecords, automationSettings } from '../services/authService'
import { complaintRecords, technicianRecords, vendorRecords } from '../services/operationsService'
import { roleRecords } from '../services/roleService'
import { filterUsers, userRecords } from '../services/userService'
import type { AdminModuleContextValue, ComplaintStatusCounts, FilterState } from '../types'

const defaultFilters: FilterState = {
  search: '',
  dateRange: '30d',
  campus: 'All',
  department: 'All',
  role: 'All',
  status: 'All',
  approval: 'All',
  complaintStatus: 'All',
}

export function useAdminFilters(): AdminModuleContextValue {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  return useMemo(() => {
    const users = filterUsers(userRecords, filters)
    const complaintsInScope = complaintRecords.filter((record) => {
      const campusMatch = filters.campus === 'All' || record.campus === filters.campus
      const deptMatch = filters.department === 'All' || record.department === filters.department
      return campusMatch && deptMatch
    })
    const complaintStatusCounts: ComplaintStatusCounts = {
      New: 0,
      'In Review': 0,
      Assigned: 0,
      Resolved: 0,
      Escalated: 0,
    }
    complaintsInScope.forEach((record) => {
      complaintStatusCounts[record.status] += 1
    })
    const complaints = complaintsInScope.filter((record) => (
      filters.complaintStatus === 'All' || record.status === filters.complaintStatus
    ))
    const vendors = vendorRecords.filter(
      (record) => filters.campus === 'All' || record.campus === filters.campus
    )
    const technicians = technicianRecords.filter((record) => {
      const campusMatch = filters.campus === 'All' || record.campus === filters.campus
      const deptMatch = filters.department === 'All' || record.department === filters.department
      return campusMatch && deptMatch
    })
    const sessions = sessionRecords.filter((record) => {
      const campusMatch = filters.campus === 'All' || record.campus === filters.campus
      const deptMatch = filters.department === 'All' || record.department === filters.department
      const roleMatch = filters.role === 'All' || record.role === filters.role
      return campusMatch && deptMatch && roleMatch
    })
    const audits = auditRecords.filter((record) => !record.id.startsWith('ACT-'))
    const activityLogs = auditRecords.filter((record) => record.id.startsWith('ACT-'))

    return {
      filters,
      setFilters,
      users,
      complaints,
      complaintsInScope,
      vendors,
      technicians,
      sessions,
      roles: roleRecords,
      audits,
      activityLogs,
      reports: reportRecords,
      notifications: notificationRecords,
      automation: automationSettings,
      complaintStatusCounts,
      kpis: {
        totalUsers: users.length,
        activeUsers: users.filter((user) => user.status === 'Active').length,
        suspendedUsers: users.filter((user) => user.status === 'Suspended').length,
        pendingApprovals: users.filter((user) => user.approval === 'Pending').length,
        failedLoginsToday: users.reduce((sum, user) => sum + user.failedLoginsToday, 0),
      },
    }
  }, [filters])
}
