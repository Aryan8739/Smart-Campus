export type VendorDashboardTab =
  | 'overview'
  | 'assignments'
  | 'technicians'
  | 'sla'
  | 'settlements'
  | 'notifications'
  | 'profile'

export type TicketStatus = 'Unassigned' | 'Assigned' | 'In Progress' | 'Escalated' | 'Resolved'
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export type VendorTicket = {
  id: string
  title: string
  category: string
  location: string
  status: TicketStatus
  priority: TicketPriority
  slaHoursLeft: number
  assignedTechnicianId?: string
  createdAt: string
  updatedAt: string
}

export type VendorTechnician = {
  id: string
  name: string
  specialization: string
  workload: number
  active: boolean
  firstTimeFixRate: number
}

export type VendorInvoice = {
  id: string
  ticketId: string
  grossAmount: number
  approvedAmount: number
  status: 'Draft' | 'Submitted' | 'Approved' | 'Paid'
  settlementEta: string
}

export type VendorNotification = {
  id: string
  title: string
  detail: string
  severity: 'info' | 'warning' | 'success'
  isRead: boolean
  at: string
}

export const ticketStatusTone: Record<TicketStatus, string> = {
  Unassigned: 'border-[rgb(var(--color-danger))/0.4] bg-[rgb(var(--color-danger))/0.12] text-[rgb(var(--color-danger))]',
  Assigned:
    'border-[rgb(var(--color-primary))/0.4] bg-[rgb(var(--color-primary))/0.12] text-[rgb(var(--color-primary))]',
  'In Progress':
    'border-[rgb(var(--color-warning))/0.4] bg-[rgb(var(--color-warning))/0.12] text-[rgb(var(--color-warning))]',
  Escalated:
    'border-[rgb(var(--color-accent))/0.4] bg-[rgb(var(--color-accent))/0.12] text-[rgb(var(--color-accent))]',
  Resolved:
    'border-[rgb(var(--color-success))/0.4] bg-[rgb(var(--color-success))/0.12] text-[rgb(var(--color-success))]',
}

export const ticketPriorityTone: Record<TicketPriority, string> = {
  Low: 'border-[rgb(var(--color-success))/0.35] bg-[rgb(var(--color-success))/0.1] text-[rgb(var(--color-success))]',
  Medium:
    'border-[rgb(var(--color-warning))/0.35] bg-[rgb(var(--color-warning))/0.1] text-[rgb(var(--color-warning))]',
  High: 'border-[rgb(var(--color-danger))/0.35] bg-[rgb(var(--color-danger))/0.1] text-[rgb(var(--color-danger))]',
  Critical:
    'border-[rgb(var(--color-danger))/0.45] bg-[rgb(var(--color-danger))/0.18] text-[rgb(var(--color-danger))]',
}
