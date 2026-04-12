import { useMemo, useState } from 'react'
import CustomerSidebar from '../../components/customerDashboard/CustomerSidebar'
import BillingTab from '../../components/customerDashboard/tabs/BillingTab'
import NotificationsTab from '../../components/customerDashboard/tabs/NotificationsTab'
import OverviewTab from '../../components/customerDashboard/tabs/OverviewTab'
import ProfileTab from '../../components/customerDashboard/tabs/ProfileTab'
import RaiseComplaintTab from '../../components/customerDashboard/tabs/RaiseComplaintTab'
import TrackerTab from '../../components/customerDashboard/tabs/TrackerTab'
import WorkspaceTab from '../../components/customerDashboard/tabs/WorkspaceTab'
import {
  type Complaint,
  type CustomerDashboardTab,
  type FeedbackItem,
  type InvoiceSummary,
  type NotificationItem,
  type Priority,
  type SortOrder,
} from '../../components/customerDashboard/types'
import { useAuth } from '../../contexts/useAuth'

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

  const [activeTab, setActiveTab] = useState<CustomerDashboardTab>('overview')

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

  const sidebarCounts = useMemo(
    () => ({
      complaints: complaints.length,
      open: metrics.open,
      notifications: notifications.length,
      pendingInvoices: invoices.filter((item) => item.status !== 'Paid').length,
    }),
    [complaints.length, invoices, metrics.open, notifications.length],
  )

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
    setActiveTab('workspace')

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

  const content = (() => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            userName={user?.name ?? 'Customer'}
            metrics={metrics}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )
      case 'raise':
        return (
          <RaiseComplaintTab
            title={newTitle}
            category={newCategory}
            location={newLocation}
            priority={newPriority}
            description={newDescription}
            categoryOptions={categoryOptions}
            formError={formError}
            formMessage={formMessage}
            onTitleChange={setNewTitle}
            onCategoryChange={setNewCategory}
            onLocationChange={setNewLocation}
            onPriorityChange={setNewPriority}
            onDescriptionChange={setNewDescription}
            onSubmit={handleCreateComplaint}
          />
        )
      case 'tracker':
        return (
          <TrackerTab
            complaints={filteredComplaints}
            totalCount={complaints.length}
            searchInput={searchInput}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            sortOrder={sortOrder}
            categories={categories}
            statuses={statuses}
            priorities={priorities}
            onSearchInputChange={setSearchInput}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onSortChange={setSortOrder}
            onApplySearch={applySearch}
            onResetFilters={resetFilters}
            selectedComplaintId={selectedComplaintId}
            onSelectComplaint={setSelectedComplaintId}
            onOpenWorkspace={() => setActiveTab('workspace')}
          />
        )
      case 'workspace':
        return (
          <WorkspaceTab
            complaint={selectedComplaint}
            feedback={selectedComplaintFeedback}
            feedbackRating={feedbackRating}
            feedbackComment={feedbackComment}
            uploadError={uploadError}
            uploadMessage={uploadMessage}
            feedbackError={feedbackError}
            feedbackMessage={feedbackMessage}
            onEvidenceUpload={handleEvidenceUpload}
            onFeedbackRatingChange={setFeedbackRating}
            onFeedbackCommentChange={setFeedbackComment}
            onSubmitFeedback={submitFeedback}
            onReopen={handleReopenRequest}
          />
        )
      case 'billing':
        return <BillingTab invoices={invoices} />
      case 'notifications':
        return <NotificationsTab notifications={notifications} />
      case 'profile':
        return (
          <ProfileTab
            profile={{
              name: user?.name ?? 'Customer User',
              email: user?.email ?? 'customer@gbu.ac.in',
              role: (user?.role ?? 'customer').replace('_', ' ').toUpperCase(),
              department: user?.department ?? 'Student Services',
            }}
          />
        )
      default:
        return null
    }
  })()

  return (
    <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-7 md:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[300px_1fr]">
        <CustomerSidebar activeTab={activeTab} onTabChange={setActiveTab} counts={sidebarCounts} />
        <div>{content}</div>
      </div>
    </main>
  )
}

export default CustomerDashboardAdvancedPage
