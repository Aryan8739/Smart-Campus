import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TechnicianSidebar from '../../components/technicianDashboard/TechnicianSidebar'
import InsightsTab from '../../components/technicianDashboard/tabs/InsightsTab'
import MaterialsTab from '../../components/technicianDashboard/tabs/MaterialsTab'
import NotificationsTab from '../../components/technicianDashboard/tabs/NotificationsTab'
import OverviewTab from '../../components/technicianDashboard/tabs/OverviewTab'
import ProfileTab from '../../components/technicianDashboard/tabs/ProfileTab'
import ProgressTab from '../../components/technicianDashboard/tabs/ProgressTab'
import ProofTab from '../../components/technicianDashboard/tabs/ProofTab'
import TasksTab from '../../components/technicianDashboard/tabs/TasksTab'
import type {
  MaterialUsageRecord,
  TechnicianDashboardTab,
  TechnicianNotification,
  TechnicianTask,
} from '../../components/technicianDashboard/types'
import { useAuth } from '../../contexts/useAuth'

const initialTasks: TechnicianTask[] = [
  {
    id: 'TK-5102',
    title: 'Water leakage in Faculty Block washroom line',
    category: 'Plumbing',
    location: 'Faculty Block - 2nd Floor',
    status: 'Assigned',
    priority: 'High',
    slaHoursLeft: 5,
    scheduledAt: 'Today, 10:00 AM',
    checklistCompleted: 0,
    checklistTotal: 4,
    materialLinked: false,
    proofUploaded: false,
  },
  {
    id: 'TK-5091',
    title: 'HVAC airflow issue in Seminar Hall A',
    category: 'HVAC',
    location: 'Seminar Hall A',
    status: 'On Site',
    priority: 'Critical',
    slaHoursLeft: 3,
    scheduledAt: 'Today, 9:15 AM',
    checklistCompleted: 2,
    checklistTotal: 5,
    materialLinked: true,
    proofUploaded: false,
    startedAt: 'Today, 9:24 AM',
  },
  {
    id: 'TK-5077',
    title: 'Smart lock recalibration at North Gate',
    category: 'Security',
    location: 'North Gate',
    status: 'Closure Requested',
    priority: 'Medium',
    slaHoursLeft: 8,
    scheduledAt: 'Today, 8:00 AM',
    checklistCompleted: 4,
    checklistTotal: 4,
    materialLinked: true,
    proofUploaded: true,
    startedAt: 'Today, 8:12 AM',
  },
  {
    id: 'TK-5054',
    title: 'Classroom board power port replacement',
    category: 'Electrical',
    location: 'Academic Block C-112',
    status: 'Resolved',
    priority: 'Low',
    slaHoursLeft: 0,
    scheduledAt: 'Yesterday, 11:30 AM',
    checklistCompleted: 3,
    checklistTotal: 3,
    materialLinked: true,
    proofUploaded: true,
    startedAt: 'Yesterday, 11:35 AM',
    closedAt: 'Yesterday, 3:20 PM',
  },
]

const initialMaterials: MaterialUsageRecord[] = [
  {
    id: 'MAT-1',
    taskId: 'TK-5091',
    itemName: 'HVAC Filter Cartridge',
    issuedQty: 2,
    usedQty: 1,
    unit: 'nos',
    verified: true,
  },
  {
    id: 'MAT-2',
    taskId: 'TK-5077',
    itemName: 'Digital Lock Connector',
    issuedQty: 1,
    usedQty: 1,
    unit: 'nos',
    verified: true,
  },
  {
    id: 'MAT-3',
    taskId: 'TK-5102',
    itemName: 'CPVC Pipe Segment',
    issuedQty: 4,
    usedQty: 3,
    unit: 'mtr',
    verified: false,
  },
]

const initialNotifications: TechnicianNotification[] = [
  {
    id: 'TN-1',
    title: 'Progress update reminder',
    detail: 'TK-5091 has no update in last 45 minutes. Capture current stage.',
    severity: 'warning',
    isRead: false,
    at: 'Today, 10:12 AM',
  },
  {
    id: 'TN-2',
    title: 'Closure checklist passed',
    detail: 'TK-5077 has all validations complete. Submit closure request.',
    severity: 'success',
    isRead: false,
    at: 'Today, 9:40 AM',
  },
  {
    id: 'TN-3',
    title: 'Material variance noticed',
    detail: 'TK-5102 material usage requires verification by inventory desk.',
    severity: 'info',
    isRead: true,
    at: 'Today, 9:15 AM',
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

function TechnicianDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const defaultProfile = {
    technicianName: user?.name ?? 'Technician User',
    specialization: user?.department ?? 'Electrical + HVAC',
    email: user?.email ?? 'technician@gbu.ac.in',
    phone: '+91-9810076543',
    shiftWindow: 'Morning 8:00 AM - 4:00 PM',
  }

  const [activeTab, setActiveTab] = useState<TechnicianDashboardTab>('overview')
  const [tasks, setTasks] = useState<TechnicianTask[]>(initialTasks)
  const [materials, setMaterials] = useState<MaterialUsageRecord[]>(initialMaterials)
  const [notifications, setNotifications] = useState<TechnicianNotification[]>(initialNotifications)

  const [selectedTaskId, setSelectedTaskId] = useState('TK-5102')
  const [progressNote, setProgressNote] = useState('')
  const [completionNote, setCompletionNote] = useState('')
  const [beforeProof, setBeforeProof] = useState(false)
  const [afterProof, setAfterProof] = useState(false)

  const [taskMessage, setTaskMessage] = useState('')
  const [progressMessage, setProgressMessage] = useState('')
  const [proofMessage, setProofMessage] = useState('')
  const [materialMessage, setMaterialMessage] = useState('')

  const [profile, setProfile] = useState(defaultProfile)
  const [reminderAlerts, setReminderAlerts] = useState(true)
  const [delayAlerts, setDelayAlerts] = useState(true)
  const [profileMessage, setProfileMessage] = useState('')

  const [materialDraft, setMaterialDraft] = useState({
    itemName: '',
    issuedQty: 0,
    usedQty: 0,
    unit: 'nos',
  })

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks],
  )

  const pushNotification = (title: string, detail: string, severity: TechnicianNotification['severity']) => {
    setNotifications((prev) => [
      { id: crypto.randomUUID(), title, detail, severity, isRead: false, at: nowStamp() },
      ...prev,
    ])
  }

  const updateTaskStatus = (taskId: string, status: TechnicianTask['status']) => {
    if (!taskId) {
      setTaskMessage('Select a task first.')
      return
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              startedAt:
                status === 'In Progress' || status === 'On Site'
                  ? task.startedAt ?? nowStamp()
                  : task.startedAt,
            }
          : task,
      ),
    )

    setTaskMessage(`${taskId} moved to ${status}.`)
    pushNotification('Task status updated', `${taskId} moved to ${status}.`, status === 'Delayed' ? 'warning' : 'info')
  }

  const updateChecklist = (completed: number) => {
    if (!selectedTaskId) {
      setProgressMessage('Select a task first.')
      return
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === selectedTaskId
          ? {
              ...task,
              checklistCompleted: Math.min(task.checklistTotal, completed),
            }
          : task,
      ),
    )
    setProgressMessage(`Checklist progress updated for ${selectedTaskId}.`)
  }

  const requestClosure = () => {
    if (!selectedTaskId) {
      setProgressMessage('Select a task before requesting closure.')
      return
    }

    const task = tasks.find((item) => item.id === selectedTaskId)
    if (!task) {
      setProgressMessage('Selected task not found.')
      return
    }

    if (task.checklistCompleted < task.checklistTotal) {
      setProgressMessage('Complete checklist before closure request.')
      return
    }

    setTasks((prev) => prev.map((item) => (item.id === selectedTaskId ? { ...item, status: 'Closure Requested' } : item)))
    setProgressMessage(`Closure requested for ${selectedTaskId}.`)
    pushNotification('Closure requested', `${selectedTaskId} submitted for closure review.`, 'info')
  }

  const submitClosure = () => {
    if (!selectedTaskId) {
      setProofMessage('Select a task before closure submit.')
      return
    }

    if (!beforeProof || !afterProof) {
      setProofMessage('Before and after proof are mandatory for closure.')
      return
    }

    if (completionNote.trim().length < 20) {
      setProofMessage('Completion note should be at least 20 characters.')
      return
    }

    setTasks((prev) =>
      prev.map((item) =>
        item.id === selectedTaskId
          ? {
              ...item,
              status: 'Resolved',
              proofUploaded: true,
              closedAt: nowStamp(),
            }
          : item,
      ),
    )

    setProofMessage(`Closure submitted for ${selectedTaskId}.`)
    pushNotification('Task resolved', `${selectedTaskId} marked as resolved with proof.`, 'success')
  }

  const addMaterialRecord = () => {
    if (!selectedTaskId) {
      setMaterialMessage('Select a task first.')
      return
    }

    if (!materialDraft.itemName.trim() || !materialDraft.unit.trim()) {
      setMaterialMessage('Material name and unit are required.')
      return
    }

    if (materialDraft.issuedQty <= 0 || materialDraft.usedQty < 0) {
      setMaterialMessage('Enter valid quantity values.')
      return
    }

    setMaterials((prev) => [
      {
        id: crypto.randomUUID(),
        taskId: selectedTaskId,
        itemName: materialDraft.itemName.trim(),
        issuedQty: materialDraft.issuedQty,
        usedQty: materialDraft.usedQty,
        unit: materialDraft.unit.trim(),
        verified: false,
      },
      ...prev,
    ])

    setTasks((prev) => prev.map((task) => (task.id === selectedTaskId ? { ...task, materialLinked: true } : task)))

    setMaterialMessage(`Material entry added for ${selectedTaskId}.`)
    setMaterialDraft({ itemName: '', issuedQty: 0, usedQty: 0, unit: 'nos' })
  }

  const toggleMaterialVerification = (recordId: string) => {
    setMaterials((prev) =>
      prev.map((record) =>
        record.id === recordId
          ? {
              ...record,
              verified: !record.verified,
            }
          : record,
      ),
    )
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)))
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
  }

  const clearReadNotifications = () => {
    setNotifications((prev) => prev.filter((item) => !item.isRead))
  }

  const saveProfile = () => {
    setProfileMessage('Technician profile preferences saved successfully.')
    pushNotification('Profile updated', 'Technician profile details were saved.', 'success')
  }

  const resetProfile = () => {
    setProfile(defaultProfile)
    setReminderAlerts(true)
    setDelayAlerts(true)
    setProfileMessage('Profile preferences reset to default values.')
  }

  const metrics = useMemo(() => {
    const totalTasks = tasks.length
    const activeTasks = tasks.filter((task) => task.status !== 'Resolved').length
    const closurePending = tasks.filter((task) => task.status === 'Closure Requested').length
    const proofCompliance =
      totalTasks === 0 ? 0 : Math.round((tasks.filter((task) => task.proofUploaded).length / totalTasks) * 100)

    return {
      totalTasks,
      activeTasks,
      closurePending,
      firstTimeFix: 91,
      proofCompliance,
    }
  }, [tasks])

  const counters = useMemo(
    () => ({
      tasks: tasks.length,
      active: tasks.filter((task) => task.status !== 'Resolved').length,
      unread: notifications.filter((item) => !item.isRead).length,
      proofPending: tasks.filter((task) => !task.proofUploaded && task.status !== 'Resolved').length,
    }),
    [notifications, tasks],
  )

  const overviewSnapshot = useMemo(() => {
    const dueToday = tasks.filter((task) => task.status !== 'Resolved' && task.slaHoursLeft <= 8).length
    const delayed = tasks.filter((task) => task.status === 'Delayed').length
    const resolvedToday = tasks.filter((task) => task.status === 'Resolved').length
    const checklistPending = tasks.filter((task) => task.checklistCompleted < task.checklistTotal).length
    const materialMismatch = materials.filter((record) => record.issuedQty < record.usedQty || !record.verified).length
    const unreadNotifications = notifications.filter((item) => !item.isRead).length

    const recentEvents = [
      ...notifications.slice(0, 3).map((item) => ({ title: item.title, meta: `${item.at} | ${item.detail}` })),
      ...tasks.slice(0, 2).map((task) => ({ title: `${task.id} | ${task.status}`, meta: `${task.scheduledAt} | ${task.location}` })),
    ].slice(0, 6)

    return {
      dueToday,
      delayed,
      resolvedToday,
      checklistPending,
      materialMismatch,
      unreadNotifications,
      recentEvents,
    }
  }, [materials, notifications, tasks])

  const content = (() => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            technicianName={profile.technicianName}
            metrics={metrics}
            snapshot={overviewSnapshot}
            onNavigate={setActiveTab}
          />
        )
      case 'tasks':
        return (
          <TasksTab
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            message={taskMessage}
            onSelectTask={setSelectedTaskId}
            onAcceptTask={(taskId) => updateTaskStatus(taskId, 'Accepted')}
            onMarkOnSite={(taskId) => updateTaskStatus(taskId, 'On Site')}
            onStartTask={(taskId) => updateTaskStatus(taskId, 'In Progress')}
            onMarkDelayed={(taskId) => updateTaskStatus(taskId, 'Delayed')}
          />
        )
      case 'progress':
        return (
          <ProgressTab
            task={selectedTask}
            progressNote={progressNote}
            message={progressMessage}
            onProgressNoteChange={setProgressNote}
            onChecklistUpdate={updateChecklist}
            onMoveToInProgress={() => updateTaskStatus(selectedTaskId, 'In Progress')}
            onRequestClosure={requestClosure}
          />
        )
      case 'proof':
        return (
          <ProofTab
            taskId={selectedTaskId}
            beforeProof={beforeProof}
            afterProof={afterProof}
            completionNote={completionNote}
            message={proofMessage}
            onBeforeProofChange={setBeforeProof}
            onAfterProofChange={(value) => {
              setAfterProof(value)
              setTasks((prev) =>
                prev.map((task) => (task.id === selectedTaskId ? { ...task, proofUploaded: value || beforeProof } : task)),
              )
            }}
            onCompletionNoteChange={setCompletionNote}
            onSubmitClosure={submitClosure}
          />
        )
      case 'materials':
        return (
          <MaterialsTab
            taskId={selectedTaskId}
            records={materials}
            draft={materialDraft}
            message={materialMessage}
            onDraftChange={setMaterialDraft}
            onAddRecord={addMaterialRecord}
            onToggleVerify={toggleMaterialVerification}
          />
        )
      case 'insights':
        return <InsightsTab tasks={tasks} firstTimeFix={91} avgResolutionHours={12.4} qualityScore={88} />
      case 'notifications':
        return (
          <NotificationsTab
            notifications={notifications}
            onMarkRead={markNotificationRead}
            onMarkAllRead={markAllNotificationsRead}
            onClearRead={clearReadNotifications}
          />
        )
      case 'profile':
        return (
          <ProfileTab
            profile={profile}
            reminderAlerts={reminderAlerts}
            delayAlerts={delayAlerts}
            message={profileMessage}
            onProfileChange={(next) => {
              setProfile(next)
              setProfileMessage('')
            }}
            onReminderAlertsChange={(value) => {
              setReminderAlerts(value)
              setProfileMessage('')
            }}
            onDelayAlertsChange={(value) => {
              setDelayAlerts(value)
              setProfileMessage('')
            }}
            onSave={saveProfile}
            onReset={resetProfile}
          />
        )
      default:
        return null
    }
  })()

  return (
    <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-7 md:px-8 lg:h-screen lg:overflow-hidden lg:px-12 lg:py-4">
      <div className="mx-auto grid max-w-7xl gap-6 lg:h-full lg:grid-cols-[300px_1fr]">
        <TechnicianSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counters={counters}
          userInfo={{
            name: profile.technicianName,
            specialization: profile.specialization,
          }}
          onProfileClick={() => setActiveTab('profile')}
          onLogout={() => {
            logout()
            navigate('/login')
          }}
        />
        <div className="lg:h-full lg:overflow-y-auto lg:pr-1">{content}</div>
      </div>
    </main>
  )
}

export default TechnicianDashboardPage
