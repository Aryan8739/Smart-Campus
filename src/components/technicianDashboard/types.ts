export type TechnicianDashboardTab =
  | 'overview'
  | 'tasks'
  | 'progress'
  | 'proof'
  | 'materials'
  | 'insights'
  | 'notifications'
  | 'profile'

export type TechnicianTaskStatus =
  | 'Assigned'
  | 'Accepted'
  | 'On Site'
  | 'In Progress'
  | 'Closure Requested'
  | 'Resolved'
  | 'Delayed'

export type TechnicianTaskPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export type TechnicianTask = {
  id: string
  title: string
  category: string
  location: string
  status: TechnicianTaskStatus
  priority: TechnicianTaskPriority
  slaHoursLeft: number
  scheduledAt: string
  checklistCompleted: number
  checklistTotal: number
  materialLinked: boolean
  proofUploaded: boolean
  startedAt?: string
  closedAt?: string
}

export type MaterialUsageRecord = {
  id: string
  taskId: string
  itemName: string
  issuedQty: number
  usedQty: number
  unit: string
  verified: boolean
}

export type TechnicianNotification = {
  id: string
  title: string
  detail: string
  severity: 'info' | 'warning' | 'success'
  isRead: boolean
  at: string
}

export const taskStatusTone: Record<TechnicianTaskStatus, string> = {
  Assigned:
    'border-[rgb(var(--color-primary))/0.35] bg-[rgb(var(--color-primary))/0.1] text-[rgb(var(--color-primary))]',
  Accepted:
    'border-[rgb(var(--color-primary))/0.42] bg-[rgb(var(--color-primary))/0.14] text-[rgb(var(--color-primary))]',
  'On Site':
    'border-[rgb(var(--color-warning))/0.4] bg-[rgb(var(--color-warning))/0.12] text-[rgb(var(--color-warning))]',
  'In Progress':
    'border-[rgb(var(--color-accent))/0.4] bg-[rgb(var(--color-accent))/0.12] text-[rgb(var(--color-accent))]',
  'Closure Requested':
    'border-[rgb(var(--color-warning))/0.45] bg-[rgb(var(--color-warning))/0.14] text-[rgb(var(--color-warning))]',
  Resolved:
    'border-[rgb(var(--color-success))/0.42] bg-[rgb(var(--color-success))/0.12] text-[rgb(var(--color-success))]',
  Delayed: 'border-[rgb(var(--color-danger))/0.45] bg-[rgb(var(--color-danger))/0.15] text-[rgb(var(--color-danger))]',
}

export const taskPriorityTone: Record<TechnicianTaskPriority, string> = {
  Low: 'border-[rgb(var(--color-success))/0.35] bg-[rgb(var(--color-success))/0.1] text-[rgb(var(--color-success))]',
  Medium:
    'border-[rgb(var(--color-warning))/0.35] bg-[rgb(var(--color-warning))/0.1] text-[rgb(var(--color-warning))]',
  High: 'border-[rgb(var(--color-danger))/0.35] bg-[rgb(var(--color-danger))/0.1] text-[rgb(var(--color-danger))]',
  Critical:
    'border-[rgb(var(--color-danger))/0.45] bg-[rgb(var(--color-danger))/0.18] text-[rgb(var(--color-danger))]',
}
