import { useMemo, useState } from 'react'
import { useAuth } from '../../contexts/useAuth'

type ComplaintStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Reopened'
type Priority = 'Low' | 'Medium' | 'High' | 'Critical'
type SortOrder = 'Newest First' | 'Oldest First'

type TimelineEntry = {
  id: string
  label: string
  when: string
}

type Complaint = {
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

type NotificationItem = {
  id: string
  title: string
  detail: string
  at: string
  severity: 'info' | 'warning' | 'success'
}

type InvoiceSummary = {
  id: string
  complaintId: string
  amount: number
  status: 'Pending' | 'Partially Paid' | 'Paid'
  dueInDays: number
}

type FeedbackItem = {
  complaintId: string
  rating: number
  comment: string
  submittedAt: string
}

const statusBadgeClasses: Record<ComplaintStatus, string> = {
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

const priorityBadgeClasses: Record<Priority, string> = {
  Low: 'border-[rgb(var(--color-success))/0.35] bg-[rgb(var(--color-success))/0.1] text-[rgb(var(--color-success))]',
  Medium:
    'border-[rgb(var(--color-warning))/0.35] bg-[rgb(var(--color-warning))/0.1] text-[rgb(var(--color-warning))]',
  High: 'border-[rgb(var(--color-danger))/0.35] bg-[rgb(var(--color-danger))/0.1] text-[rgb(var(--color-danger))]',
  Critical:
    'border-[rgb(var(--color-danger))/0.45] bg-[rgb(var(--color-danger))/0.18] text-[rgb(var(--color-danger))]',
}

const categoryOptions = ['Electrical', 'Plumbing', 'IT/Network', 'Civil', 'Housekeeping']

const initialComplaints: Complaint[] = [
  {
    id: 'CMP-2026-301',
    title: 'AC not cooling in Computer Lab A-301',
    category: 'Electrical',
    location: 'School of Engineering Block A, Room 301',
    priority: 'High',
    status: 'In Progress',
    description:
      'Room temperature remains high during practical session hours and affects system performance.',
    createdAt: '09 Apr 2026, 10:10 AM',
    updatedAt: 'Today, 8:20 AM',
    updatedAtIso: '2026-04-12T08:20:00+05:30',
    assignedTeam: 'Electrical Response Team',
    invoiceStatus: 'Pending',
    evidence: ['lab-ac-panel.jpg'],
    timeline: [
      { id: 't1', label: 'Complaint submitted', when: '09 Apr 2026, 10:10 AM' },
      { id: 't2', label: 'Assigned to Electrical Response Team', when: '09 Apr 2026, 11:00 AM' },
      { id: 't3', label: 'On-site visit started', when: '10 Apr 2026, 9:15 AM' },
    ],
  },
  {
    id: 'CMP-2026-287',
    title: 'Water leakage in Boys Hostel 2 washroom',
    category: 'Plumbing',
    location: 'Boys Hostel 2, Room 310',
    priority: 'Medium',
    status: 'Resolved',
    description: 'Continuous water leakage from tap and drainage, causing water logging.',
    createdAt: '03 Apr 2026, 4:05 PM',
    updatedAt: 'Yesterday, 6:30 PM',
    updatedAtIso: '2026-04-11T18:30:00+05:30',
    assignedTeam: 'Plumbing Duty Team',
    invoiceStatus: 'Partially Paid',
    evidence: ['hostel-washroom-before.png', 'hostel-washroom-after.png'],
    timeline: [
      { id: 't4', label: 'Complaint submitted', when: '03 Apr 2026, 4:05 PM' },
      { id: 't5', label: 'Assigned to Plumbing Duty Team', when: '03 Apr 2026, 5:10 PM' },
      { id: 't6', label: 'Issue resolved', when: '11 Apr 2026, 6:30 PM' },
    ],
  },
  {
    id: 'CMP-2026-254',
    title: 'WiFi dead zone in Central Library reading hall',
    category: 'IT/Network',
    location: 'Central Library - Reading Hall',
    priority: 'Critical',
    status: 'Open',
    description: 'Frequent disconnections in the east wing during peak study hours.',
    createdAt: '01 Apr 2026, 2:40 PM',
    updatedAt: 'Today, 7:45 AM',
    updatedAtIso: '2026-04-12T07:45:00+05:30',
    assignedTeam: 'Pending Assignment',
    invoiceStatus: 'Not Generated',
    evidence: [],
    timeline: [{ id: 't7', label: 'Complaint submitted', when: '01 Apr 2026, 2:40 PM' }],
  },
]

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'SLA Reminder',
    detail: 'CMP-2026-254 is nearing response SLA threshold.',
    at: 'Today, 8:00 AM',
    severity: 'warning',
  },
  {
    id: 'n2',
    title: 'Work Update',
    detail: 'Technician progress updated for CMP-2026-301.',
    at: 'Yesterday, 7:15 PM',
    severity: 'info',
  },
  {
    id: 'n3',
    title: 'Feedback Reminder',
    detail: 'Please rate your resolved complaint CMP-2026-287.',
    at: 'Yesterday, 6:40 PM',
    severity: 'success',
  },
]

const initialInvoices: InvoiceSummary[] = [
  { id: 'INV-114', complaintId: 'CMP-2026-301', amount: 2400, status: 'Pending', dueInDays: 7 },
  {
    id: 'INV-108',
    complaintId: 'CMP-2026-287',
    amount: 1200,
    status: 'Partially Paid',
    dueInDays: 3,
  },
]

function nowStamp() {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
}

function buildComplaintId(totalItems: number) {
  return `CMP-2026-${String(400 + totalItems + 1).padStart(3, '0')}`
}

function CustomerDashboardAdvancedPage() {
  const { user } = useAuth()

  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [invoices] = useState<InvoiceSummary[]>(initialInvoices)
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackItem[]>([
    {
      complaintId: 'CMP-2026-287',
      rating: 4,
      comment: 'Issue resolved and washroom condition is much better now.',
      submittedAt: '11 Apr 2026, 8:15 PM',
    },
  ])

  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(initialComplaints[0]?.id ?? '')

  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [priorityFilter, setPriorityFilter] = useState('All Priorities')
  const [sortOrder, setSortOrder] = useState<SortOrder>('Newest First')

  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState(categoryOptions[0])
  const [newLocation, setNewLocation] = useState('')
  const [newPriority, setNewPriority] = useState<Priority>('Medium')
  const [newDescription, setNewDescription] = useState('')
  const [formError, setFormError] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const [uploadError, setUploadError] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')

  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const categories = useMemo(
    () => ['All Categories', ...new Set(complaints.map((item) => item.category))],
    [complaints],
  )

  const statuses = useMemo(
    () => ['All Status', ...new Set(complaints.map((item) => item.status))],
    [complaints],
  )

  const priorities = useMemo(
    () => ['All Priorities', ...new Set(complaints.map((item) => item.priority))],
    [complaints],
  )

  const filteredComplaints = useMemo(() => {
    const rows = complaints.filter((item) => {
      const categoryMatched = categoryFilter === 'All Categories' || item.category === categoryFilter
      const statusMatched = statusFilter === 'All Status' || item.status === statusFilter
      const priorityMatched = priorityFilter === 'All Priorities' || item.priority === priorityFilter
      const searchMatched =
        appliedSearch.trim() === '' ||
        item.id.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        item.title.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        item.location.toLowerCase().includes(appliedSearch.toLowerCase())

      return categoryMatched && statusMatched && priorityMatched && searchMatched
    })

    return [...rows].sort((a, b) => {
      const aTime = new Date(a.updatedAtIso).getTime()
      const bTime = new Date(b.updatedAtIso).getTime()
      return sortOrder === 'Newest First' ? bTime - aTime : aTime - bTime
    })
  }, [appliedSearch, categoryFilter, complaints, priorityFilter, sortOrder, statusFilter])

  const selectedComplaint = useMemo(
    () => complaints.find((item) => item.id === selectedComplaintId) ?? null,
    [complaints, selectedComplaintId],
  )

  const selectedComplaintFeedback = useMemo(
    () => feedbackEntries.find((item) => item.complaintId === selectedComplaintId) ?? null,
    [feedbackEntries, selectedComplaintId],
  )

  const metrics = useMemo(() => {
    const total = complaints.length
    const open = complaints.filter((item) => item.status === 'Open' || item.status === 'Reopened').length
    const inProgress = complaints.filter((item) => item.status === 'Assigned' || item.status === 'In Progress').length
    const resolved = complaints.filter((item) => item.status === 'Resolved').length

    return {
      total,
      open,
      inProgress,
      resolved,
      responseScore: total > 0 ? Math.round((resolved / total) * 100) : 0,
    }
  }, [complaints])

  const invoiceMetrics = useMemo(() => {
    const totalAmount = invoices.reduce((sum, item) => sum + item.amount, 0)
    const paidCount = invoices.filter((item) => item.status === 'Paid').length
    const pendingCount = invoices.filter((item) => item.status !== 'Paid').length

    return {
      totalAmount,
      paidCount,
      pendingCount,
    }
  }, [invoices])

  const applySearch = () => {
    setAppliedSearch(searchInput.trim())
  }

  const resetFilters = () => {
    setSearchInput('')
    setAppliedSearch('')
    setCategoryFilter('All Categories')
    setStatusFilter('All Status')
    setPriorityFilter('All Priorities')
    setSortOrder('Newest First')
  }

  const pushNotification = (title: string, detail: string, severity: NotificationItem['severity']) => {
    setNotifications((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        detail,
        severity,
        at: nowStamp(),
      },
      ...prev,
    ])
  }

  const handleCreateComplaint = () => {
    if (newTitle.trim().length < 8) {
      setFormError('Complaint title should be at least 8 characters long.')
      setFormMessage('')
      return
    }

    if (newLocation.trim().length < 5) {
      setFormError('Please enter a valid location with sufficient details.')
      setFormMessage('')
      return
    }

    if (newDescription.trim().length < 20) {
      setFormError('Description should clearly explain the issue in at least 20 characters.')
      setFormMessage('')
      return
    }

    const ticketId = buildComplaintId(complaints.length)
    const timestamp = nowStamp()
    const complaint: Complaint = {
      id: ticketId,
      title: newTitle.trim(),
      category: newCategory,
      location: newLocation.trim(),
      priority: newPriority,
      status: 'Open',
      description: newDescription.trim(),
      createdAt: timestamp,
      updatedAt: 'Just now',
      updatedAtIso: new Date().toISOString(),
      assignedTeam: 'Pending Assignment',
      invoiceStatus: 'Not Generated',
      evidence: [],
      timeline: [{ id: crypto.randomUUID(), label: 'Complaint submitted', when: timestamp }],
    }

    setComplaints((prev) => [complaint, ...prev])
    setSelectedComplaintId(complaint.id)

    setNewTitle('')
    setNewCategory(categoryOptions[0])
    setNewLocation('')
    setNewPriority('Medium')
    setNewDescription('')

    setFormError('')
    setFormMessage(`${ticketId} created successfully. You will receive assignment update shortly.`)

    pushNotification('Complaint Acknowledged', `${ticketId} has been registered in queue.`, 'success')
  }

  const handleEvidenceUpload = (files: FileList | null) => {
    if (!selectedComplaint || !files || files.length === 0) {
      return
    }

    const maxSizeBytes = 10 * 1024 * 1024
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4']

    const acceptedNames: string[] = []
    const rejectedNames: string[] = []

    Array.from(files).forEach((file) => {
      const validType = allowedMimeTypes.includes(file.type)
      const validSize = file.size <= maxSizeBytes
      if (validType && validSize) {
        acceptedNames.push(file.name)
      } else {
        rejectedNames.push(file.name)
      }
    })

    if (acceptedNames.length > 0) {
      setComplaints((prev) =>
        prev.map((item) => {
          if (item.id !== selectedComplaint.id) {
            return item
          }

          return {
            ...item,
            evidence: [...item.evidence, ...acceptedNames],
            updatedAt: 'Just now',
            updatedAtIso: new Date().toISOString(),
            timeline: [
              ...item.timeline,
              {
                id: crypto.randomUUID(),
                label: `Evidence uploaded (${acceptedNames.length} file(s))`,
                when: nowStamp(),
              },
            ],
          }
        }),
      )

      setUploadMessage(`${acceptedNames.length} file(s) attached to ${selectedComplaint.id}.`)
      setUploadError('')
      pushNotification('Evidence Added', `${selectedComplaint.id} updated with new attachments.`, 'info')
    }

    if (rejectedNames.length > 0) {
      setUploadError(
        `These files were rejected: ${rejectedNames.join(', ')}. Allowed formats: JPG, PNG, MP4 (max 10MB).`,
      )
    }
  }

  const handleReopenRequest = () => {
    if (!selectedComplaint || selectedComplaint.status !== 'Resolved') {
      return
    }

    setComplaints((prev) =>
      prev.map((item) => {
        if (item.id !== selectedComplaint.id) {
          return item
        }

        return {
          ...item,
          status: 'Reopened',
          updatedAt: 'Just now',
          updatedAtIso: new Date().toISOString(),
          timeline: [
            ...item.timeline,
            {
              id: crypto.randomUUID(),
              label: 'Customer requested reopen with review note',
              when: nowStamp(),
            },
          ],
        }
      }),
    )

    pushNotification('Reopen Request Submitted', `${selectedComplaint.id} moved to reopened queue.`, 'warning')
  }

  const submitFeedback = () => {
    if (!selectedComplaint || selectedComplaint.status !== 'Resolved') {
      return
    }

    if (feedbackComment.trim().length < 10) {
      setFeedbackError('Please add a meaningful comment with at least 10 characters.')
      setFeedbackMessage('')
      return
    }

    setFeedbackEntries((prev) => {
      const withoutCurrent = prev.filter((item) => item.complaintId !== selectedComplaint.id)
      return [
        {
          complaintId: selectedComplaint.id,
          rating: feedbackRating,
          comment: feedbackComment.trim(),
          submittedAt: nowStamp(),
        },
        ...withoutCurrent,
      ]
    })

    setFeedbackError('')
    setFeedbackMessage('Feedback submitted successfully. Thank you for helping us improve service quality.')
    setFeedbackComment('')

    pushNotification('Feedback Recorded', `Quality feedback received for ${selectedComplaint.id}.`, 'success')
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-7 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.75)] md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.25] bg-[rgb(var(--color-primary))/0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--color-primary))]">
                Customer Service Workspace
              </p>
              <h1 className="mt-3 text-2xl font-bold text-[rgb(var(--color-text-primary))] md:text-3xl">
                Welcome, {user?.name ?? 'Customer'}
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-[rgb(var(--color-text-secondary))] md:text-base">
                Raise complaints, track real-time status, upload evidence, monitor billing, and close the quality loop with feedback.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-sm text-[rgb(var(--color-text-secondary))]">
              <p className="font-semibold text-[rgb(var(--color-text-primary))]">Personal Response Score</p>
              <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{metrics.responseScore}%</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
              <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Total Complaints</p>
              <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-text-primary))]">{metrics.total}</p>
            </article>
            <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
              <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Open or Reopened</p>
              <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-danger))]">{metrics.open}</p>
            </article>
            <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
              <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Assigned or In Progress</p>
              <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{metrics.inProgress}</p>
            </article>
            <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
              <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Resolved</p>
              <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{metrics.resolved}</p>
            </article>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Raise a New Complaint</h2>
              <span className="text-xs text-[rgb(var(--color-text-secondary))]">Acknowledgement enabled</span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Complaint title"
                className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm text-[rgb(var(--color-text-primary))]"
              />
              <input
                value={newLocation}
                onChange={(event) => setNewLocation(event.target.value)}
                placeholder="Location"
                className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm text-[rgb(var(--color-text-primary))]"
              />
              <select
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
              >
                {categoryOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                value={newPriority}
                onChange={(event) => setNewPriority(event.target.value as Priority)}
                className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            <textarea
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              rows={3}
              placeholder="Describe issue with enough detail so assignment team can act quickly."
              className="mt-3 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm text-[rgb(var(--color-text-primary))]"
            />

            {formError ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-danger))]">{formError}</p> : null}
            {formMessage ? (
              <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-success))]">{formMessage}</p>
            ) : null}

            <button
              type="button"
              onClick={handleCreateComplaint}
              className="mt-4 inline-flex rounded-xl bg-[rgb(var(--color-primary))] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
            >
              Submit Complaint
            </button>
          </article>

          <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold">Notifications & Alerts</h2>
            <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
              Auto reminders for SLA, work updates, and feedback loops.
            </p>
            <div className="mt-4 space-y-2.5">
              {notifications.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</p>
                    <span
                      className={[
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                        item.severity === 'success'
                          ? 'bg-[rgb(var(--color-success))/0.15] text-[rgb(var(--color-success))]'
                          : item.severity === 'warning'
                            ? 'bg-[rgb(var(--color-warning))/0.15] text-[rgb(var(--color-warning))]'
                            : 'bg-[rgb(var(--color-primary))/0.15] text-[rgb(var(--color-primary))]',
                      ].join(' ')}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{item.detail}</p>
                  <p className="mt-1 text-[11px] text-[rgb(var(--color-text-secondary))]">{item.at}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Complaint Tracker</h2>
              <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                {filteredComplaints.length} of {complaints.length} shown
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    applySearch()
                  }
                }}
                placeholder="Search by ID, title, or location"
                className="min-w-56 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={applySearch}
                className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-medium text-white"
              >
                Search
              </button>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
              >
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
              >
                {priorities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs font-medium"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {filteredComplaints.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedComplaintId(item.id)}
                  className={[
                    'w-full rounded-2xl border p-4 text-left transition',
                    selectedComplaintId === item.id
                      ? 'border-[rgb(var(--color-primary))/0.55] bg-[rgb(var(--color-primary))/0.08]'
                      : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] hover:border-[rgb(var(--color-primary))/0.35]',
                  ].join(' ')}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">{item.id}</p>
                    <div className="flex gap-2">
                      <span className={['rounded-full border px-2 py-1 text-xs font-semibold', priorityBadgeClasses[item.priority]].join(' ')}>
                        {item.priority}
                      </span>
                      <span className={['rounded-full border px-2 py-1 text-xs font-semibold', statusBadgeClasses[item.status]].join(' ')}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</h3>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                    {item.category} | {item.location}
                  </p>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Updated: {item.updatedAt}</p>
                </button>
              ))}

              {filteredComplaints.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4 text-sm text-[rgb(var(--color-text-secondary))]">
                  No complaint records match your filter criteria.
                </p>
              ) : null}
            </div>
          </article>

          <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold">Billing Summary</h2>
            <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
              Invoice transparency for complaint-linked services.
            </p>

            <div className="mt-4 grid gap-2">
              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">Total Billed Amount</p>
                <p className="mt-1 text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                  Rs. {invoiceMetrics.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">Pending Invoices</p>
                <p className="mt-1 text-xl font-semibold text-[rgb(var(--color-warning))]">{invoiceMetrics.pendingCount}</p>
              </div>
              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">Paid Invoices</p>
                <p className="mt-1 text-xl font-semibold text-[rgb(var(--color-success))]">{invoiceMetrics.paidCount}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {invoices.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">{item.id}</p>
                    <span
                      className={[
                        'rounded-full px-2 py-1 text-[10px] font-semibold',
                        item.status === 'Paid'
                          ? 'bg-[rgb(var(--color-success))/0.15] text-[rgb(var(--color-success))]'
                          : item.status === 'Partially Paid'
                            ? 'bg-[rgb(var(--color-primary))/0.15] text-[rgb(var(--color-primary))]'
                            : 'bg-[rgb(var(--color-warning))/0.15] text-[rgb(var(--color-warning))]',
                      ].join(' ')}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{item.complaintId}</p>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                    Rs. {item.amount.toLocaleString('en-IN')} | Due in {item.dueInDays} day(s)
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-semibold">Selected Complaint Workspace</h2>

          {selectedComplaint ? (
            <div className="mt-4 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
              <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">{selectedComplaint.id}</p>
                    <h3 className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{selectedComplaint.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <span className={['rounded-full border px-2 py-1 text-xs font-semibold', priorityBadgeClasses[selectedComplaint.priority]].join(' ')}>
                      {selectedComplaint.priority}
                    </span>
                    <span className={['rounded-full border px-2 py-1 text-xs font-semibold', statusBadgeClasses[selectedComplaint.status]].join(' ')}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm text-[rgb(var(--color-text-secondary))]">{selectedComplaint.description}</p>

                <div className="mt-3 grid gap-2 text-xs text-[rgb(var(--color-text-secondary))] sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-[rgb(var(--color-text-primary))]">Location:</span> {selectedComplaint.location}
                  </p>
                  <p>
                    <span className="font-semibold text-[rgb(var(--color-text-primary))]">Assigned Team:</span> {selectedComplaint.assignedTeam}
                  </p>
                  <p>
                    <span className="font-semibold text-[rgb(var(--color-text-primary))]">Created:</span> {selectedComplaint.createdAt}
                  </p>
                  <p>
                    <span className="font-semibold text-[rgb(var(--color-text-primary))]">Invoice:</span> {selectedComplaint.invoiceStatus}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Timeline</p>
                  <ul className="mt-2 space-y-2">
                    {selectedComplaint.timeline.map((step) => (
                      <li
                        key={step.id}
                        className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2"
                      >
                        <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{step.label}</p>
                        <p className="text-xs text-[rgb(var(--color-text-secondary))]">{step.when}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="space-y-4">
                <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
                  <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Upload Evidence</h4>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Allowed: JPG, PNG, MP4 up to 10MB</p>

                  <label
                    htmlFor="evidence-upload"
                    className="mt-3 block cursor-pointer rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-4 text-center text-xs text-[rgb(var(--color-text-secondary))]"
                  >
                    Select file(s) for {selectedComplaint.id}
                  </label>
                  <input
                    id="evidence-upload"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.mp4"
                    onChange={(event) => handleEvidenceUpload(event.target.files)}
                    className="hidden"
                  />

                  {selectedComplaint.evidence.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-xs text-[rgb(var(--color-text-secondary))]">
                      {selectedComplaint.evidence.map((entry) => (
                        <li key={entry}>• {entry}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-[rgb(var(--color-text-secondary))]">No evidence uploaded yet.</p>
                  )}

                  {uploadError ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-danger))]">{uploadError}</p> : null}
                  {uploadMessage ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-success))]">{uploadMessage}</p> : null}
                </div>

                <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
                  <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Reopen Request</h4>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                    If service quality is unsatisfactory after closure, raise reopen request with proof.
                  </p>
                  <button
                    type="button"
                    onClick={handleReopenRequest}
                    disabled={selectedComplaint.status !== 'Resolved'}
                    className="mt-3 rounded-lg bg-[rgb(var(--color-danger))] px-3 py-2 text-xs font-semibold text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Request Reopen
                  </button>
                </div>

                <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
                  <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Feedback & Rating</h4>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                    Mandatory service quality feedback for resolved complaints.
                  </p>

                  {selectedComplaint.status === 'Resolved' ? (
                    <>
                      {selectedComplaintFeedback ? (
                        <div className="mt-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-3">
                          <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                            Submitted Rating: {selectedComplaintFeedback.rating}/5
                          </p>
                          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{selectedComplaintFeedback.comment}</p>
                          <p className="mt-1 text-[11px] text-[rgb(var(--color-text-secondary))]">{selectedComplaintFeedback.submittedAt}</p>
                        </div>
                      ) : null}

                      <div className="mt-3 flex gap-2">
                        <label className="text-xs text-[rgb(var(--color-text-secondary))]">Rating</label>
                        <select
                          value={feedbackRating}
                          onChange={(event) => setFeedbackRating(Number(event.target.value))}
                          className="rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1 text-xs"
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                      </div>

                      <textarea
                        value={feedbackComment}
                        onChange={(event) => setFeedbackComment(event.target.value)}
                        rows={2}
                        placeholder="Share service quality remarks"
                        className="mt-2 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-2 text-xs"
                      />

                      {feedbackError ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-danger))]">{feedbackError}</p> : null}
                      {feedbackMessage ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-success))]">{feedbackMessage}</p> : null}

                      <button
                        type="button"
                        onClick={submitFeedback}
                        className="mt-3 rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
                      >
                        Submit Feedback
                      </button>
                    </>
                  ) : (
                    <p className="mt-3 text-xs text-[rgb(var(--color-text-secondary))]">
                      Feedback will be enabled when complaint status becomes Resolved.
                    </p>
                  )}
                </div>
              </article>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4 text-sm text-[rgb(var(--color-text-secondary))]">
              Select a complaint from tracker to view full workspace details.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

export default CustomerDashboardAdvancedPage
