import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VendorSidebar from '../../components/vendorDashboard/VendorSidebar'
import AssignmentsTab from '../../components/vendorDashboard/tabs/AssignmentsTab'
import NotificationsTab from '../../components/vendorDashboard/tabs/NotificationsTab'
import OverviewTab from '../../components/vendorDashboard/tabs/OverviewTab'
import ProfileTab from '../../components/vendorDashboard/tabs/ProfileTab'
import SettlementsTab from '../../components/vendorDashboard/tabs/SettlementsTab'
import SlaTab from '../../components/vendorDashboard/tabs/SlaTab'
import TechniciansTab from '../../components/vendorDashboard/tabs/TechniciansTab'
import type {
  VendorDashboardTab,
  VendorInvoice,
  VendorNotification,
  VendorTechnician,
  VendorTicket,
} from '../../components/vendorDashboard/types'
import { useAuth } from '../../contexts/useAuth'

const initialTickets: VendorTicket[] = [
  {
    id: 'CMP-2201',
    title: 'Power fluctuation in Main Auditorium wing',
    category: 'Electrical',
    location: 'Main Auditorium',
    status: 'Unassigned',
    priority: 'High',
    slaHoursLeft: 6,
    createdAt: '11 Apr 2026, 9:10 AM',
    updatedAt: 'Today, 8:35 AM',
  },
  {
    id: 'CMP-2186',
    title: 'Hostel C water line pressure issue',
    category: 'Plumbing',
    location: 'Boys Hostel C',
    status: 'Assigned',
    priority: 'Medium',
    slaHoursLeft: 12,
    assignedTechnicianId: 'TECH-2',
    createdAt: '10 Apr 2026, 3:05 PM',
    updatedAt: 'Today, 7:40 AM',
  },
  {
    id: 'CMP-2159',
    title: 'Cooling failure in server control room',
    category: 'HVAC',
    location: 'IT Control Room',
    status: 'Escalated',
    priority: 'Critical',
    slaHoursLeft: 2,
    assignedTechnicianId: 'TECH-1',
    createdAt: '09 Apr 2026, 8:20 AM',
    updatedAt: 'Today, 8:10 AM',
  },
  {
    id: 'CMP-2148',
    title: 'Damaged gate lock mechanism',
    category: 'Security',
    location: 'North Gate',
    status: 'Resolved',
    priority: 'Low',
    slaHoursLeft: 0,
    assignedTechnicianId: 'TECH-3',
    createdAt: '08 Apr 2026, 1:10 PM',
    updatedAt: 'Yesterday, 6:10 PM',
  },
]

const initialTechnicians: VendorTechnician[] = [
  { id: 'TECH-1', name: 'Aman Yadav', specialization: 'HVAC', workload: 4, active: true, firstTimeFixRate: 92 },
  { id: 'TECH-2', name: 'Suresh Kumar', specialization: 'Plumbing', workload: 3, active: true, firstTimeFixRate: 88 },
  { id: 'TECH-3', name: 'Neha Sharma', specialization: 'Electrical', workload: 2, active: true, firstTimeFixRate: 90 },
  { id: 'TECH-4', name: 'Ravi Singh', specialization: 'Security Systems', workload: 1, active: false, firstTimeFixRate: 81 },
]

const initialInvoices: VendorInvoice[] = [
  { id: 'INV-VEN-91', ticketId: 'CMP-2148', grossAmount: 14000, approvedAmount: 13200, status: 'Draft', settlementEta: '3 days' },
  { id: 'INV-VEN-88', ticketId: 'CMP-2101', grossAmount: 22000, approvedAmount: 21000, status: 'Submitted', settlementEta: '5 days' },
  { id: 'INV-VEN-77', ticketId: 'CMP-2065', grossAmount: 18000, approvedAmount: 17600, status: 'Approved', settlementEta: '2 days' },
]

const initialNotifications: VendorNotification[] = [
  {
    id: 'VN-1',
    title: 'SLA breach risk',
    detail: 'CMP-2159 has less than 2h SLA window. Escalate immediately.',
    severity: 'warning',
    isRead: false,
    at: 'Today, 8:10 AM',
  },
  {
    id: 'VN-2',
    title: 'Invoice action',
    detail: 'INV-VEN-91 is still in draft. Submit to finance desk.',
    severity: 'info',
    isRead: false,
    at: 'Today, 7:50 AM',
  },
  {
    id: 'VN-3',
    title: 'Quality update',
    detail: 'Last 7-day first-time-fix crossed 90% benchmark.',
    severity: 'success',
    isRead: true,
    at: 'Yesterday, 6:10 PM',
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

function VendorDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<VendorDashboardTab>('overview')

  const [tickets, setTickets] = useState<VendorTicket[]>(initialTickets)
  const [technicians, setTechnicians] = useState<VendorTechnician[]>(initialTechnicians)
  const [invoices, setInvoices] = useState<VendorInvoice[]>(initialInvoices)
  const [notifications, setNotifications] = useState<VendorNotification[]>(initialNotifications)

  const [selectedTicketId, setSelectedTicketId] = useState('CMP-2201')
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('')
  const [assignmentNote, setAssignmentNote] = useState('')
  const [assignmentMessage, setAssignmentMessage] = useState('')

  const [profile, setProfile] = useState({
    managerName: user?.name ?? 'Vendor Manager',
    companyName: 'XY Facilities Pvt Ltd',
    email: user?.email ?? 'vendor@gbu.ac.in',
    phone: '+91-9810011122',
    operatingZones: 'Academic Block, Library, North Gate',
  })
  const [settlementAlerts, setSettlementAlerts] = useState(true)
  const [slaAlerts, setSlaAlerts] = useState(true)
  const [profileMessage, setProfileMessage] = useState('')

  const metrics = useMemo(() => {
    const totalTickets = tickets.length
    const assignedTickets = tickets.filter((ticket) => ticket.status === 'Assigned' || ticket.status === 'In Progress').length
    const highRisk = tickets.filter((ticket) => ticket.slaHoursLeft <= 8 && ticket.status !== 'Resolved').length
    const avgSla = 92
    const firstTimeFix = Math.round(technicians.reduce((sum, t) => sum + t.firstTimeFixRate, 0) / technicians.length)

    return { totalTickets, assignedTickets, highRisk, avgSla, firstTimeFix }
  }, [tickets, technicians])

  const counters = useMemo(
    () => ({
      tickets: tickets.length,
      pending: tickets.filter((ticket) => ticket.status !== 'Resolved').length,
      unread: notifications.filter((note) => !note.isRead).length,
      settlements: invoices.filter((item) => item.status !== 'Paid').length,
    }),
    [invoices, notifications, tickets],
  )

  const overviewSnapshot = useMemo(() => {
    const unassigned = tickets.filter((ticket) => ticket.status === 'Unassigned').length
    const escalated = tickets.filter((ticket) => ticket.status === 'Escalated').length
    const resolved = tickets.filter((ticket) => ticket.status === 'Resolved').length
    const activeTechniciansCount = technicians.filter((tech) => tech.active).length
    const averageWorkload = activeTechniciansCount
      ? Number(
          (
            technicians
              .filter((tech) => tech.active)
              .reduce((sum, tech) => sum + tech.workload, 0) / activeTechniciansCount
          ).toFixed(1),
        )
      : 0
    const unreadNotifications = notifications.filter((note) => !note.isRead).length
    const draftInvoices = invoices.filter((invoice) => invoice.status === 'Draft').length
    const approvedInvoices = invoices.filter(
      (invoice) => invoice.status === 'Approved' || invoice.status === 'Paid',
    ).length
    const approvedValue = invoices.reduce((sum, invoice) => sum + invoice.approvedAmount, 0)

    const recentEvents = [
      ...notifications.slice(0, 2).map((item) => ({
        title: item.title,
        meta: `${item.at} | ${item.detail}`,
      })),
      ...tickets.slice(0, 2).map((ticket) => ({
        title: `${ticket.id} | ${ticket.status}`,
        meta: `${ticket.updatedAt} | ${ticket.location}`,
      })),
      ...invoices.slice(0, 1).map((invoice) => ({
        title: `${invoice.id} | ${invoice.status}`,
        meta: `${invoice.settlementEta} | Rs. ${invoice.approvedAmount.toLocaleString('en-IN')}`,
      })),
    ].slice(0, 6)

    return {
      unassigned,
      escalated,
      resolved,
      activeTechnicians: activeTechniciansCount,
      averageWorkload,
      unreadNotifications,
      draftInvoices,
      approvedInvoices,
      approvedValue,
      recentEvents,
    }
  }, [invoices, notifications, tickets, technicians])

  const assignableTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status !== 'Resolved'),
    [tickets],
  )

  const activeTechnicians = useMemo(
    () => technicians.filter((tech) => tech.active),
    [technicians],
  )

  const pushNotification = (title: string, detail: string, severity: VendorNotification['severity']) => {
    setNotifications((prev) => [
      { id: crypto.randomUUID(), title, detail, severity, isRead: false, at: nowStamp() },
      ...prev,
    ])
  }

  const assignTicket = (ticketId: string, technicianId: string, note = '') => {
    if (!ticketId || !technicianId) {
      setAssignmentMessage('Select both ticket and technician first.')
      return
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              assignedTechnicianId: technicianId,
              status: 'Assigned',
              updatedAt: nowStamp(),
            }
          : ticket,
      ),
    )

    setTechnicians((prev) =>
      prev.map((tech) =>
        tech.id === technicianId
          ? {
              ...tech,
              workload: tech.workload + 1,
            }
          : tech,
      ),
    )

    const techName = technicians.find((item) => item.id === technicianId)?.name ?? technicianId
    setAssignmentMessage(`${ticketId} assigned to ${techName}${note ? ` | Note: ${note}` : ''}`)
    pushNotification('Assignment completed', `${ticketId} assigned to ${techName}.`, 'success')
    setAssignmentNote('')
  }

  const autoAssign = () => {
    const ticket = assignableTickets.find((item) => item.id === selectedTicketId)
    if (!ticket) {
      setAssignmentMessage('No assignable ticket selected.')
      return
    }

    const bestTech = [...activeTechnicians].sort((a, b) => a.workload - b.workload)[0]
    if (!bestTech) {
      setAssignmentMessage('No active technician available for auto assignment.')
      return
    }

    setSelectedTechnicianId(bestTech.id)
    assignTicket(ticket.id, bestTech.id, 'Auto-assigned by workload balancer')
  }

  const toggleTechnician = (id: string) => {
    setTechnicians((prev) =>
      prev.map((tech) => (tech.id === id ? { ...tech, active: !tech.active } : tech)),
    )
  }

  const rebalanceWorkload = () => {
    const active = technicians.filter((tech) => tech.active)
    if (!active.length) {
      pushNotification('Rebalance skipped', 'No active technician found.', 'warning')
      return
    }

    const average = Math.max(1, Math.round(active.reduce((sum, tech) => sum + tech.workload, 0) / active.length))
    setTechnicians((prev) =>
      prev.map((tech) =>
        tech.active
          ? {
              ...tech,
              workload: average,
            }
          : tech,
      ),
    )
    pushNotification('Workload rebalanced', 'Active technician loads were normalized.', 'info')
  }

  const submitInvoice = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: 'Submitted', settlementEta: '4 days' } : invoice,
      ),
    )
    pushNotification('Invoice submitted', `${invoiceId} sent for finance approval.`, 'success')
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
  }

  const saveProfile = () => {
    setProfileMessage('Vendor profile preferences saved successfully.')
    pushNotification('Profile updated', 'Vendor account preferences were saved.', 'info')
  }

  const content = (() => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            vendorName={profile.companyName}
            metrics={metrics}
            snapshot={overviewSnapshot}
            onNavigate={setActiveTab}
          />
        )
      case 'assignments':
        return (
          <AssignmentsTab
            tickets={assignableTickets}
            technicians={activeTechnicians}
            selectedTicketId={selectedTicketId}
            selectedTechnicianId={selectedTechnicianId}
            assignmentNote={assignmentNote}
            message={assignmentMessage}
            onSelectTicket={setSelectedTicketId}
            onTechnicianChange={setSelectedTechnicianId}
            onAssignmentNoteChange={setAssignmentNote}
            onAssign={() => assignTicket(selectedTicketId, selectedTechnicianId, assignmentNote)}
            onAutoAssign={autoAssign}
          />
        )
      case 'technicians':
        return (
          <TechniciansTab
            technicians={technicians}
            onToggleActive={toggleTechnician}
            onRebalance={rebalanceWorkload}
          />
        )
      case 'sla':
        return <SlaTab tickets={tickets} />
      case 'settlements':
        return <SettlementsTab invoices={invoices} onSubmitInvoice={submitInvoice} />
      case 'notifications':
        return (
          <NotificationsTab
            notifications={notifications}
            onMarkRead={markNotificationRead}
            onMarkAllRead={markAllRead}
          />
        )
      case 'profile':
        return (
          <ProfileTab
            profile={profile}
            settlementAlerts={settlementAlerts}
            slaAlerts={slaAlerts}
            message={profileMessage}
            onProfileChange={(next) => {
              setProfile(next)
              setProfileMessage('')
            }}
            onSettlementAlertsChange={(value) => {
              setSettlementAlerts(value)
              setProfileMessage('')
            }}
            onSlaAlertsChange={(value) => {
              setSlaAlerts(value)
              setProfileMessage('')
            }}
            onSave={saveProfile}
          />
        )
      default:
        return null
    }
  })()

  return (
    <main className="min-h-screen bg-[rgb(var(--color-bg))] px-4 py-7 md:px-8 lg:h-screen lg:overflow-hidden lg:px-12 lg:py-4">
      <div className="mx-auto grid max-w-7xl gap-6 lg:h-full lg:grid-cols-[300px_1fr]">
        <VendorSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counters={counters}
          userInfo={{
            name: profile.managerName,
            company: profile.companyName,
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

export default VendorDashboardPage
