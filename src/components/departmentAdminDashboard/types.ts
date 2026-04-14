export type DepartmentAdminTab =
  | 'overview'
  | 'intake'
  | 'teams'
  | 'sla'
  | 'budget'
  | 'notifications'
  | 'reports'
  | 'profile'

export type DepartmentTicketStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Escalated'
  | 'Resolved'

export type DepartmentTicketPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export type DepartmentTicket = {
  id: string
  title: string
  category: string
  location: string
  status: DepartmentTicketStatus
  priority: DepartmentTicketPriority
  slaHoursLeft: number
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export type DepartmentTeamMember = {
  id: string
  name: string
  skill: string
  active: boolean
  workload: number
  shift: 'Morning' | 'General' | 'Evening'
  closureRate: number
}

export type DepartmentBudgetRecord = {
  id: string
  bucket: string
  allocated: number
  utilized: number
  month: string
}

export type DepartmentNotification = {
  id: string
  title: string
  detail: string
  severity: 'info' | 'warning' | 'success'
  isRead: boolean
  at: string
}

export const ticketStatusTone: Record<DepartmentTicketStatus, string> = {
  Open: 'border-[rgb(var(--color-danger))/0.4] bg-[rgb(var(--color-danger))/0.12] text-[rgb(var(--color-danger))]',
  Assigned:
    'border-[rgb(var(--color-primary))/0.4] bg-[rgb(var(--color-primary))/0.12] text-[rgb(var(--color-primary))]',
  'In Progress':
    'border-[rgb(var(--color-warning))/0.4] bg-[rgb(var(--color-warning))/0.12] text-[rgb(var(--color-warning))]',
  Escalated:
    'border-[rgb(var(--color-accent))/0.4] bg-[rgb(var(--color-accent))/0.12] text-[rgb(var(--color-accent))]',
  Resolved:
    'border-[rgb(var(--color-success))/0.4] bg-[rgb(var(--color-success))/0.12] text-[rgb(var(--color-success))]',
}

export const ticketPriorityTone: Record<DepartmentTicketPriority, string> = {
  Low: 'border-[rgb(var(--color-success))/0.35] bg-[rgb(var(--color-success))/0.1] text-[rgb(var(--color-success))]',
  Medium:
    'border-[rgb(var(--color-warning))/0.35] bg-[rgb(var(--color-warning))/0.1] text-[rgb(var(--color-warning))]',
  High: 'border-[rgb(var(--color-danger))/0.35] bg-[rgb(var(--color-danger))/0.1] text-[rgb(var(--color-danger))]',
  Critical:
    'border-[rgb(var(--color-danger))/0.45] bg-[rgb(var(--color-danger))/0.18] text-[rgb(var(--color-danger))]',
}
