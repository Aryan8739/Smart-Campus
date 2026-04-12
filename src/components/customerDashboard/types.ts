export type ComplaintStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Reopened'
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'
export type SortOrder = 'Newest First' | 'Oldest First'

export type TimelineEntry = {
  id: string
  label: string
  when: string
}

export type Complaint = {
  id: string
  title: string
  category: string
  location: string
  priority: Priority
  status: ComplaintStatus
  description: string
  createdAt: string
  updatedAt: string
  updatedAtIso: string
  assignedTeam: string
  invoiceStatus: 'Not Generated' | 'Pending' | 'Partially Paid' | 'Paid'
  evidence: string[]
  timeline: TimelineEntry[]
}

export type NotificationItem = {
  id: string
  title: string
  detail: string
  at: string
  severity: 'info' | 'warning' | 'success'
}

export type InvoiceSummary = {
  id: string
  complaintId: string
  amount: number
  status: 'Pending' | 'Partially Paid' | 'Paid'
  dueInDays: number
}

export type FeedbackItem = {
  complaintId: string
  rating: number
  comment: string
  submittedAt: string
}

export type CustomerDashboardTab =
  | 'overview'
  | 'raise'
  | 'tracker'
  | 'workspace'
  | 'billing'
  | 'notifications'
  | 'profile'

export const statusBadgeClasses: Record<ComplaintStatus, string> = {
  Open: 'border-[rgb(var(--color-danger))/0.45] bg-[rgb(var(--color-danger))/0.14] text-[rgb(var(--color-danger))]',
  Assigned:
    'border-[rgb(var(--color-warning))/0.45] bg-[rgb(var(--color-warning))/0.14] text-[rgb(var(--color-warning))]',
  'In Progress':
    'border-[rgb(var(--color-primary))/0.45] bg-[rgb(var(--color-primary))/0.14] text-[rgb(var(--color-primary))]',
  Resolved:
    'border-[rgb(var(--color-success))/0.45] bg-[rgb(var(--color-success))/0.14] text-[rgb(var(--color-success))]',
  Reopened:
    'border-[rgb(var(--color-accent))/0.45] bg-[rgb(var(--color-accent))/0.14] text-[rgb(var(--color-accent))]',
}

export const priorityBadgeClasses: Record<Priority, string> = {
  Low: 'border-[rgb(var(--color-success))/0.35] bg-[rgb(var(--color-success))/0.1] text-[rgb(var(--color-success))]',
  Medium:
    'border-[rgb(var(--color-warning))/0.35] bg-[rgb(var(--color-warning))/0.1] text-[rgb(var(--color-warning))]',
  High: 'border-[rgb(var(--color-danger))/0.35] bg-[rgb(var(--color-danger))/0.1] text-[rgb(var(--color-danger))]',
  Critical:
    'border-[rgb(var(--color-danger))/0.45] bg-[rgb(var(--color-danger))/0.18] text-[rgb(var(--color-danger))]',
}
