import type { ComplaintRecord, TechnicianRecord, VendorRecord } from '../features/userAccess/types'

export type TechnicianAvailability = 'Available' | 'Busy' | 'Offline' | 'Suspended'

export interface TechnicianWorkHistoryItem {
  id: string
  title: string
  status: ComplaintRecord['status']
  createdDate: string
  priority: ComplaintRecord['priority']
}

export interface TechnicianManagementRecord extends TechnicianRecord {
  skill: string
  completedTasks: number
  pendingTasks: number
  averageResolutionTime: string
  performanceScore: number
  availabilityStatus: TechnicianAvailability
  phone: string
  email: string
  assignedVendor: string
  activeTasks: TechnicianWorkHistoryItem[]
  workHistory: TechnicianWorkHistoryItem[]
  slaScore: number
}

export interface TechnicianFormValues {
  name: string
  department: string
  skill: string
  phone: string
  email: string
  assignedVendor: string
  availabilityStatus: TechnicianAvailability
}

export const technicianSkillOptions = ['Electrical', 'IT', 'Civil', 'HVAC', 'Security', 'Administration']
export const technicianAvailabilityOptions = ['All', 'Available', 'Busy', 'Offline', 'Suspended'] as const

const technicianMetadata: Record<string, Omit<TechnicianManagementRecord, keyof TechnicianRecord>> = {
  'TEC-1': {
    skill: 'Civil',
    completedTasks: 41,
    pendingTasks: 5,
    averageResolutionTime: '5h 40m',
    performanceScore: 78,
    availabilityStatus: 'Busy',
    phone: '+91 97000 41231',
    email: 'amit.yadav@gbu.ac.in',
    assignedVendor: 'XY Facilities',
    activeTasks: [
      { id: 'CMP-2041', title: 'Main server room cooling issue', status: 'New', createdDate: '11 Mar 2026', priority: 'High' },
    ],
    workHistory: [
      { id: 'CMP-1934', title: 'Cooling duct inspection', status: 'Resolved', createdDate: '28 Feb 2026', priority: 'Medium' },
      { id: 'CMP-1908', title: 'Pressure valve recalibration', status: 'Resolved', createdDate: '21 Feb 2026', priority: 'Low' },
    ],
    slaScore: 88,
  },
  'TEC-2': {
    skill: 'Administration',
    completedTasks: 39,
    pendingTasks: 2,
    averageResolutionTime: '3h 50m',
    performanceScore: 91,
    availabilityStatus: 'Available',
    phone: '+91 98180 66789',
    email: 'riya.nanda@gbu.ac.in',
    assignedVendor: 'Z1 Maintenance',
    activeTasks: [
      { id: 'CMP-2032', title: 'Hostel C water line maintenance', status: 'Assigned', createdDate: '10 Mar 2026', priority: 'Medium' },
    ],
    workHistory: [
      { id: 'CMP-1914', title: 'Water meter alignment', status: 'Resolved', createdDate: '25 Feb 2026', priority: 'Low' },
    ],
    slaScore: 94,
  },
  'TEC-3': {
    skill: 'Electrical',
    completedTasks: 46,
    pendingTasks: 1,
    averageResolutionTime: '3h 15m',
    performanceScore: 96,
    availabilityStatus: 'Available',
    phone: '+91 98990 66771',
    email: 'sneha.verma@gbu.ac.in',
    assignedVendor: 'Prime Infra',
    activeTasks: [],
    workHistory: [
      { id: 'CMP-2018', title: 'Library lighting panel fault', status: 'Resolved', createdDate: '08 Mar 2026', priority: 'Low' },
      { id: 'CMP-1892', title: 'Switchboard repair', status: 'Resolved', createdDate: '19 Feb 2026', priority: 'Medium' },
    ],
    slaScore: 97,
  },
}

export function buildTechnicianRecords(
  technicians: TechnicianRecord[],
  complaints: ComplaintRecord[],
  vendors: VendorRecord[]
): TechnicianManagementRecord[] {
  return technicians.map((technician) => {
    const metadata = technicianMetadata[technician.id]
    const complaintMatches = complaints.filter((complaint) => complaint.technician === technician.name)
    const assignedVendor = vendors.find((vendor) => vendor.campus === technician.campus)?.name ?? metadata.assignedVendor

    return {
      ...technician,
      ...metadata,
      assignedVendor,
      activeTasks: complaintMatches
        .filter((complaint) => complaint.status !== 'Resolved')
        .map((complaint) => ({
          id: complaint.id,
          title: complaint.title,
          status: complaint.status,
          createdDate: complaint.createdDate,
          priority: complaint.priority,
        })),
      workHistory: [
        ...metadata.workHistory,
        ...complaintMatches
          .filter((complaint) => complaint.status === 'Resolved')
          .map((complaint) => ({
            id: complaint.id,
            title: complaint.title,
            status: complaint.status,
            createdDate: complaint.createdDate,
            priority: complaint.priority,
          })),
      ],
    }
  })
}

export function getTechnicianStatusTone(status: TechnicianAvailability) {
  if (status === 'Available') return 'success'
  if (status === 'Busy') return 'warning'
  if (status === 'Offline' || status === 'Suspended') return 'danger'
  return 'neutral'
}

export function getTechnicianAlerts(technician: TechnicianManagementRecord) {
  const alerts: string[] = []
  if (technician.assignedTasks >= 10 || technician.pendingTasks >= 5) alerts.push('Technician overloaded')
  if (!technician.assignedVendor) alerts.push('No technician assigned vendor')
  if (technician.performanceScore < 80) alerts.push('Low performance detected')
  return alerts
}

export function getEmptyTechnicianForm(defaultVendor = ''): TechnicianFormValues {
  return {
    name: '',
    department: '',
    skill: 'Electrical',
    phone: '',
    email: '',
    assignedVendor: defaultVendor,
    availabilityStatus: 'Available',
  }
}
