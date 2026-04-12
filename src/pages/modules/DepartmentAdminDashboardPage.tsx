import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DepartmentAdminSidebar from '../../components/departmentAdminDashboard/DepartmentAdminSidebar'
import BudgetTab from '../../components/departmentAdminDashboard/tabs/BudgetTab'
import IntakeTab from '../../components/departmentAdminDashboard/tabs/IntakeTab'
import NotificationsTab from '../../components/departmentAdminDashboard/tabs/NotificationsTab'
import OverviewTab from '../../components/departmentAdminDashboard/tabs/OverviewTab'
import ProfileTab from '../../components/departmentAdminDashboard/tabs/ProfileTab'
import ReportsTab from '../../components/departmentAdminDashboard/tabs/ReportsTab'
import SlaTab from '../../components/departmentAdminDashboard/tabs/SlaTab'
import TeamsTab from '../../components/departmentAdminDashboard/tabs/TeamsTab'
import type {
  DepartmentAdminTab,
  DepartmentBudgetRecord,
  DepartmentNotification,
  DepartmentTeamMember,
  DepartmentTicket,
  DepartmentTicketStatus,
} from '../../components/departmentAdminDashboard/types'
import { useAuth } from '../../contexts/useAuth'

const initialTickets: DepartmentTicket[] = [
  {
    id: 'DPT-4012',
    title: 'Classroom projector failure in Block B-207',
    category: 'Electrical',
    location: 'Academic Block B',
    status: 'Open',
    priority: 'High',
    slaHoursLeft: 5,
    createdAt: '11 Apr 2026, 9:10 AM',
    updatedAt: 'Today, 8:15 AM',
  },
  {
    id: 'DPT-3981',
    title: 'Drinking water cooler maintenance pending',
    category: 'Plumbing',
    location: 'Library Ground Floor',
    status: 'Assigned',
    priority: 'Medium',
    slaHoursLeft: 10,
    assignedTo: 'TM-2',
    createdAt: '10 Apr 2026, 2:20 PM',
    updatedAt: 'Today, 7:40 AM',
  },
  {
    id: 'DPT-3964',
    title: 'Network outage in examination control room',
    category: 'IT/Network',
    location: 'Exam Cell',
    status: 'Escalated',
    priority: 'Critical',
    slaHoursLeft: 2,
    assignedTo: 'TM-1',
    createdAt: '10 Apr 2026, 11:30 AM',
    updatedAt: 'Today, 8:45 AM',
  },
  {
    id: 'DPT-3922',
    title: 'Corridor light replacement completed',
    category: 'Electrical',
    location: 'Admin Wing',
    status: 'Resolved',
    priority: 'Low',
    slaHoursLeft: 0,
    assignedTo: 'TM-4',
    createdAt: '08 Apr 2026, 1:30 PM',
    updatedAt: 'Yesterday, 6:00 PM',
  },
]

const initialTeams: DepartmentTeamMember[] = [
  { id: 'TM-1', name: 'Rahul Verma', skill: 'Network', active: true, workload: 4, shift: 'Morning', closureRate: 91 },
  { id: 'TM-2', name: 'Nitin Das', skill: 'Plumbing', active: true, workload: 3, shift: 'General', closureRate: 87 },
  { id: 'TM-3', name: 'Pooja Gupta', skill: 'Electrical', active: true, workload: 2, shift: 'General', closureRate: 93 },
  { id: 'TM-4', name: 'Aarti Sharma', skill: 'Civil', active: false, workload: 1, shift: 'Evening', closureRate: 84 },
]

const initialBudget: DepartmentBudgetRecord[] = [
  { id: 'B-1', bucket: 'Electrical Maintenance', allocated: 400000, utilized: 314000, month: 'Apr 2026' },
  { id: 'B-2', bucket: 'Civil Repairs', allocated: 300000, utilized: 192000, month: 'Apr 2026' },
  { id: 'B-3', bucket: 'IT Infrastructure', allocated: 500000, utilized: 448000, month: 'Apr 2026' },
]

const initialNotifications: DepartmentNotification[] = [
  {
    id: 'DN-1',
    title: 'Critical SLA risk',
    detail: 'DPT-3964 is below 2h SLA window. Immediate action required.',
    severity: 'warning',
    isRead: false,
    at: 'Today, 8:50 AM',
  },
  {
    id: 'DN-2',
    title: 'Budget near limit',
    detail: 'IT Infrastructure line crossed 85% utilization.',
    severity: 'warning',
    isRead: false,
    at: 'Today, 7:45 AM',
  },
  {
    id: 'DN-3',
    title: 'Resolution quality',
    detail: 'Closure rate maintained above 90% this week.',
    severity: 'success',
    isRead: true,
    at: 'Yesterday, 6:20 PM',
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

function DepartmentAdminDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const defaultProfile = {
    adminName: user?.name ?? 'Department Admin',
    departmentName: user?.department ?? 'Central Operations',
    email: user?.email ?? 'department.admin@gbu.ac.in',
    phone: '+91-9810012345',
    escalationWindow: 'Escalate if unresolved within 6 hours',
  }

  const [activeTab, setActiveTab] = useState<DepartmentAdminTab>('overview')
  const [tickets, setTickets] = useState<DepartmentTicket[]>(initialTickets)
  const [teams, setTeams] = useState<DepartmentTeamMember[]>(initialTeams)
  const [budget] = useState<DepartmentBudgetRecord[]>(initialBudget)
  const [notifications, setNotifications] = useState<DepartmentNotification[]>(initialNotifications)

  const [profile, setProfile] = useState(defaultProfile)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [slackAlerts, setSlackAlerts] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')

  const pushNotification = (title: string, detail: string, severity: DepartmentNotification['severity']) => {
    setNotifications((prev) => [{ id: crypto.randomUUID(), title, detail, severity, isRead: false, at: nowStamp() }, ...prev])
  }

  const assignTicket = (ticketId: string, teamMemberId: string) => {
    if (!ticketId || !teamMemberId) {
      return
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              assignedTo: teamMemberId,
              status: 'Assigned',
              updatedAt: nowStamp(),
            }
          : ticket,
      ),
    )

    setTeams((prev) => prev.map((member) => (member.id === teamMemberId ? { ...member, workload: member.workload + 1 } : member)))
    pushNotification('Assignment completed', `${ticketId} assigned to ${teamMemberId}.`, 'info')
  }

  const changeTicketStatus = (ticketId: string, status: DepartmentTicketStatus) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status, updatedAt: nowStamp() } : ticket)))
    pushNotification('Ticket status updated', `${ticketId} moved to ${status}.`, status === 'Resolved' ? 'success' : 'info')
  }

  const escalateTicket = (ticketId: string) => {
    if (!ticketId) {
      return
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'Escalated',
              updatedAt: nowStamp(),
            }
          : ticket,
      ),
    )

    pushNotification('Ticket escalated', `${ticketId} moved to escalation queue.`, 'warning')
  }

  const toggleTeamMember = (id: string) => {
    setTeams((prev) => prev.map((member) => (member.id === id ? { ...member, active: !member.active } : member)))
  }

  const changeShift = (id: string, shift: DepartmentTeamMember['shift']) => {
    setTeams((prev) => prev.map((member) => (member.id === id ? { ...member, shift } : member)))
  }

  const rebalanceWorkload = () => {
    const activeMembers = teams.filter((member) => member.active)
    if (!activeMembers.length) {
      return
    }

    const average = Math.max(1, Math.round(activeMembers.reduce((sum, member) => sum + member.workload, 0) / activeMembers.length))
    setTeams((prev) => prev.map((member) => (member.active ? { ...member, workload: average } : member)))
    pushNotification('Workload normalized', 'Active team member loads were balanced.', 'info')
  }

  const raiseBudgetAlert = (recordId: string) => {
    const line = budget.find((item) => item.id === recordId)
    if (!line) {
      return
    }

    pushNotification('Budget alert generated', `${line.bucket} is nearing monthly utilization cap.`, 'warning')
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)))
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
  }

  const clearRead = () => {
    setNotifications((prev) => prev.filter((item) => !item.isRead))
  }

  const saveProfile = () => {
    setProfileMessage('Department preferences saved successfully.')
    pushNotification('Profile updated', 'Department admin preferences were saved.', 'success')
  }

  const resetProfile = () => {
    setProfile(defaultProfile)
    setEmailAlerts(true)
    setSlackAlerts(false)
    setProfileMessage('Profile reset to default values.')
  }

  const exportReport = (format: 'pdf' | 'csv') => {
    pushNotification('Report export queued', `Department report export requested in ${format.toUpperCase()} format.`, 'info')
  }

  const metrics = useMemo(() => {
    const totalTickets = tickets.length
    const openTickets = tickets.filter((item) => item.status !== 'Resolved').length
    const atRisk = tickets.filter((item) => item.slaHoursLeft <= 8 && item.status !== 'Resolved').length
    const activeTeams = teams.filter((member) => member.active).length
    const avgClosureRate = Math.round(teams.reduce((sum, member) => sum + member.closureRate, 0) / teams.length)

    return { totalTickets, openTickets, atRisk, activeTeams, avgClosureRate }
  }, [teams, tickets])

  const counters = useMemo(
    () => ({
      open: tickets.filter((item) => item.status === 'Open').length,
      escalated: tickets.filter((item) => item.status === 'Escalated').length,
      unread: notifications.filter((item) => !item.isRead).length,
      budgetAlerts: budget.filter((item) => (item.utilized / item.allocated) * 100 >= 85).length,
    }),
    [budget, notifications, tickets],
  )

  const overviewSnapshot = useMemo(() => {
    const pendingAssignments = tickets.filter((item) => !item.assignedTo && item.status !== 'Resolved').length
    const escalated = tickets.filter((item) => item.status === 'Escalated').length
    const resolvedToday = tickets.filter((item) => item.status === 'Resolved').length

    const totalAllocated = budget.reduce((sum, item) => sum + item.allocated, 0)
    const totalUtilized = budget.reduce((sum, item) => sum + item.utilized, 0)
    const budgetUtilization = totalAllocated ? Math.round((totalUtilized / totalAllocated) * 100) : 0

    const unreadAlerts = notifications.filter((item) => !item.isRead).length

    const recentEvents = [
      ...notifications.slice(0, 2).map((item) => ({
        title: item.title,
        meta: `${item.at} | ${item.detail}`,
      })),
      ...tickets.slice(0, 2).map((ticket) => ({
        title: `${ticket.id} | ${ticket.status}`,
        meta: `${ticket.updatedAt} | ${ticket.location}`,
      })),
      ...budget.slice(0, 1).map((line) => ({
        title: `${line.bucket} | ${line.month}`,
        meta: `Utilized Rs. ${line.utilized.toLocaleString('en-IN')} / Rs. ${line.allocated.toLocaleString('en-IN')}`,
      })),
    ].slice(0, 6)

    return {
      pendingAssignments,
      escalated,
      resolvedToday,
      budgetUtilization,
      unreadAlerts,
      recentEvents,
    }
  }, [budget, notifications, tickets])

  const reportKpis = useMemo(
    () => ({
      monthlyResolutionRate: 88,
      avgTurnaroundHours: 14,
      recurringIssueRate: 23,
      customerSatisfaction: 4.3,
    }),
    [],
  )

  const topIssues = useMemo(() => {
    const countMap = new Map<string, number>()
    tickets.forEach((ticket) => {
      countMap.set(ticket.category, (countMap.get(ticket.category) ?? 0) + 1)
    })

    return [...countMap.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [tickets])

  const content = (() => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            departmentName={profile.departmentName}
            metrics={metrics}
            snapshot={overviewSnapshot}
            onNavigate={setActiveTab}
          />
        )
      case 'intake':
        return (
          <IntakeTab
            tickets={tickets}
            teams={teams}
            onAssign={assignTicket}
            onStatusChange={changeTicketStatus}
            onEscalate={escalateTicket}
          />
        )
      case 'teams':
        return (
          <TeamsTab
            teams={teams}
            onToggleActive={toggleTeamMember}
            onShiftChange={changeShift}
            onRebalance={rebalanceWorkload}
          />
        )
      case 'sla':
        return <SlaTab tickets={tickets} onEscalate={escalateTicket} />
      case 'budget':
        return <BudgetTab records={budget} onRaiseAlert={raiseBudgetAlert} />
      case 'notifications':
        return (
          <NotificationsTab
            notifications={notifications}
            onMarkRead={markNotificationRead}
            onMarkAllRead={markAllRead}
            onClearRead={clearRead}
          />
        )
      case 'reports':
        return <ReportsTab kpis={reportKpis} topIssues={topIssues} onExport={exportReport} />
      case 'profile':
        return (
          <ProfileTab
            profile={profile}
            emailAlerts={emailAlerts}
            slackAlerts={slackAlerts}
            message={profileMessage}
            onProfileChange={(next) => {
              setProfile(next)
              setProfileMessage('')
            }}
            onEmailAlertsChange={(value) => {
              setEmailAlerts(value)
              setProfileMessage('')
            }}
            onSlackAlertsChange={(value) => {
              setSlackAlerts(value)
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
        <DepartmentAdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counters={counters}
          userInfo={{
            name: profile.adminName,
            department: profile.departmentName,
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

export default DepartmentAdminDashboardPage
