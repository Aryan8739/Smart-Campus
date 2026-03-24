import type { CampusCode, ComplaintRecord, TechnicianRecord, VendorRecord } from '../features/userAccess/types'

export type VendorLifecycleStatus = 'Active' | 'Suspended' | 'Under Review' | 'Pending'

export interface VendorTechnicianSummary {
  name: string
  department: string
  activeAssignments: number
}

export interface VendorComplaintHistoryItem {
  id: string
  title: string
  status: ComplaintRecord['status']
  priority: ComplaintRecord['priority']
  createdDate: string
  resolvedDate?: string
}

export interface VendorManagementRecord extends VendorRecord {
  completedTickets: number
  pendingTickets: number
  averageResolutionTime: string
  rating: number
  status: VendorLifecycleStatus
  contactPerson: string
  phone: string
  email: string
  serviceArea: string
  assignedTechnicians: VendorTechnicianSummary[]
  complaintHistory: VendorComplaintHistoryItem[]
}

export interface VendorFormValues {
  name: string
  category: string
  contactPerson: string
  phone: string
  email: string
  serviceArea: string
  campus: CampusCode
  slaAgreement: string
  status: Extract<VendorLifecycleStatus, 'Active' | 'Pending' | 'Suspended'>
}

export const vendorCategories = ['Electrical', 'Civil', 'IT', 'HVAC', 'Security', 'Water Supply']
export const slaRangeOptions = ['All', '95+', '90-94', 'Below 90'] as const
export const vendorStatusOptions = ['All', 'Active', 'Suspended', 'Under Review', 'Pending'] as const

const vendorMetadata: Record<string, Omit<VendorManagementRecord, keyof VendorRecord>> = {
  'VEN-1': {
    completedTickets: 86,
    pendingTickets: 4,
    averageResolutionTime: '4h 20m',
    rating: 4.8,
    status: 'Active',
    contactPerson: 'Rohan Sharma',
    phone: '+91 98990 12011',
    email: 'rohan.sharma@xyfacilities.com',
    serviceArea: 'Main Campus / Academic Block',
    assignedTechnicians: [
      { name: 'Sneha Verma', department: 'Central Operations', activeAssignments: 3 },
      { name: 'Amit Yadav', department: 'Civil Works', activeAssignments: 2 },
    ],
    complaintHistory: [
      {
        id: 'CMP-2041',
        title: 'Main server room cooling issue',
        status: 'Open',
        priority: 'High',
        createdDate: '11 Mar 2026',
      },
      {
        id: 'CMP-2004',
        title: 'Auditorium power fluctuation',
        status: 'Resolved',
        priority: 'Medium',
        createdDate: '06 Mar 2026',
        resolvedDate: '07 Mar 2026',
      },
    ],
  },
  'VEN-2': {
    completedTickets: 74,
    pendingTickets: 9,
    averageResolutionTime: '6h 05m',
    rating: 4.2,
    status: 'Under Review',
    contactPerson: 'Priya Nair',
    phone: '+91 98180 66124',
    email: 'priya.nair@z1maintenance.in',
    serviceArea: 'North Campus / Hostel & Utility Zone',
    assignedTechnicians: [
      { name: 'Riya Nanda', department: 'Administration', activeAssignments: 4 },
    ],
    complaintHistory: [
      {
        id: 'CMP-2032',
        title: 'Hostel C water line maintenance',
        status: 'Assigned',
        priority: 'Medium',
        createdDate: '10 Mar 2026',
      },
      {
        id: 'CMP-1988',
        title: 'Mess block drainage inspection',
        status: 'Resolved',
        priority: 'Low',
        createdDate: '03 Mar 2026',
        resolvedDate: '04 Mar 2026',
      },
    ],
  },
  'VEN-3': {
    completedTickets: 51,
    pendingTickets: 8,
    averageResolutionTime: '7h 15m',
    rating: 3.9,
    status: 'Pending',
    contactPerson: 'Arvind Menon',
    phone: '+91 97000 54117',
    email: 'arvind.menon@primeinfra.in',
    serviceArea: 'Research Park / Labs Cluster',
    assignedTechnicians: [],
    complaintHistory: [
      {
        id: 'CMP-2018',
        title: 'Library lighting panel fault',
        status: 'Resolved',
        priority: 'Low',
        createdDate: '08 Mar 2026',
        resolvedDate: '08 Mar 2026',
      },
      {
        id: 'CMP-1961',
        title: 'Chiller backup calibration',
        status: 'Escalated',
        priority: 'High',
        createdDate: '01 Mar 2026',
      },
    ],
  },
}

export function buildVendorRecords(
  vendors: VendorRecord[],
  complaints: ComplaintRecord[],
  technicians: TechnicianRecord[]
): VendorManagementRecord[] {
  return vendors.map((vendor) => {
    const metadata = vendorMetadata[vendor.id]
    const vendorComplaints = complaints.filter((complaint) => complaint.vendor === vendor.name)
    const openLikeComplaints = vendorComplaints.filter((complaint) => complaint.status !== 'Resolved').length

    return {
      ...vendor,
      ...metadata,
      activeTickets: Math.max(vendor.activeTickets, openLikeComplaints || vendor.activeTickets),
      assignedTechnicians:
        metadata.assignedTechnicians.length > 0
          ? metadata.assignedTechnicians
          : technicians
              .filter((technician) => technician.campus === vendor.campus)
              .slice(0, 1)
              .map((technician) => ({
                name: technician.name,
                department: technician.department,
                activeAssignments: Math.max(1, Math.round(technician.assignedTasks / 3)),
              })),
      complaintHistory:
        metadata.complaintHistory.length > 0
          ? metadata.complaintHistory
          : vendorComplaints.map((complaint) => ({
              id: complaint.id,
              title: complaint.title,
              status: complaint.status,
              priority: complaint.priority,
              createdDate: complaint.createdDate,
            })),
    }
  })
}

export function getVendorAlerts(vendor: VendorManagementRecord) {
  const alerts: string[] = []

  if (vendor.slaScore < 90) {
    alerts.push('Vendor SLA is below target threshold.')
  }
  if (vendor.pendingTickets >= 8) {
    alerts.push('Pending workload is unusually high.')
  }
  if (vendor.assignedTechnicians.length === 0) {
    alerts.push('No active technicians assigned.')
  }

  return alerts
}

export function getVendorStatusTone(status: VendorLifecycleStatus) {
  if (status === 'Active') return 'success'
  if (status === 'Suspended') return 'danger'
  if (status === 'Under Review') return 'warning'
  return 'neutral'
}

export function getEmptyVendorForm(): VendorFormValues {
  return {
    name: '',
    category: 'Electrical',
    contactPerson: '',
    phone: '',
    email: '',
    serviceArea: '',
    campus: 'Main Campus',
    slaAgreement: '90',
    status: 'Active',
  }
}
