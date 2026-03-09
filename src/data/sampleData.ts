// Sample data for testing - All India-specific names and locations

export const sampleUsers = [
  {
    id: '1',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@gbu.ac.in',
    role: 'customer',
    department: 'Computer Science',
    rollNo: '235UCS052',
    mobile: '+91-9876543210',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@gbu.ac.in',
    role: 'customer',
    department: 'Electronics & Communication',
    rollNo: '235ECE023',
    mobile: '+91-9876543211',
  },
  {
    id: '3',
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@staff.gbu.ac.in',
    role: 'technician',
    department: 'Maintenance',
    employeeId: 'EMP001',
    specialization: 'Electrical',
    mobile: '+91-8765432109',
  },
  {
    id: '4',
    name: 'Suresh Yadav',
    email: 'suresh.yadav@staff.gbu.ac.in',
    role: 'technician',
    department: 'Maintenance',
    employeeId: 'EMP002',
    specialization: 'Plumbing',
    mobile: '+91-8765432108',
  },
  {
    id: '5',
    name: 'Dr. Sunita Sharma',
    email: 'sunita.sharma@gbu.ac.in',
    role: 'department_admin',
    department: 'Computer Science',
    employeeId: 'FAC123',
    designation: 'Associate Professor & HOD',
    mobile: '+91-9988776655',
  },
]

export const campusLocations = [
  // Academic Buildings
  'School of Engineering Block A',
  'School of Engineering Block B',
  'School of Engineering Block C',
  'Computer Lab - Block A, Room 301',
  'Electronics Lab - Block B, Room 205',
  'Central Library - Ground Floor',
  'Central Library - Reading Hall',
  'Auditorium - Main Building',
  'Seminar Hall - Block A',
  'Conference Room - Admin Block',
  
  // Hostels
  'Boys Hostel 1 (BH-1) - Room 205',
  'Boys Hostel 2 (BH-2) - Room 310',
  'Boys Hostel 3 (BH-3) - Common Room',
  'Girls Hostel 1 (GH-1) - Room 105',
  'Girls Hostel 2 (GH-2) - Room 208',
  'Hostel Mess - BH-1',
  
  // Common Areas
  'Main Gate',
  'Sports Complex',
  'Basketball Court',
  'Cricket Ground',
  'Cafeteria - Block A',
  'Cafeteria - Block B',
  'Medical Center',
  'ATM - Near Main Gate',
  'Parking Area - Block A',
  'Garden Area - Central Lawn',
]

export const complaintCategories = [
  {
    id: 'electrical',
    name: 'Electrical Issues',
    subcategories: [
      'Power outage',
      'Fan not working',
      'Tube light flickering',
      'AC not cooling',
      'Geyser not heating',
      'Switchboard damaged',
      'Inverter issue',
    ],
  },
  {
    id: 'plumbing',
    name: 'Plumbing Issues',
    subcategories: [
      'Water tap leaking',
      'Toilet flush not working',
      'Washbasin blocked',
      'Water cooler not working',
      'RO water purifier issue',
      'Bathroom drainage problem',
      'No water supply',
    ],
  },
  {
    id: 'civil',
    name: 'Civil/Infrastructure',
    subcategories: [
      'Door lock broken',
      'Window pane cracked',
      'Ceiling plaster falling',
      'Floor tiles broken',
      'Wall paint peeling',
      'Furniture damaged',
      'Whiteboard not clean',
    ],
  },
  {
    id: 'it',
    name: 'IT/Network Issues',
    subcategories: [
      'WiFi not working',
      'Computer not starting',
      'Projector not working',
      'Printer jam',
      'LAN cable disconnected',
      'Server down',
      'Software installation needed',
    ],
  },
  {
    id: 'housekeeping',
    name: 'Housekeeping',
    subcategories: [
      'Dustbin not cleaned',
      'Classroom not swept',
      'Washroom not cleaned',
      'Garbage not collected',
      'Pest control needed',
      'Garden maintenance required',
    ],
  },
]

export const sampleComplaints = [
  {
    id: 'CMP001',
    title: 'AC not cooling in Computer Lab',
    location: 'Block A, Room 301',
    category: 'Electrical',
    priority: 'High',
    status: 'Open',
    description: 'Air conditioner installed in Computer Lab (Room 301, Block A) is not cooling properly. Room temperature is 32°C. Students are facing difficulty during practical sessions.',
    reportedBy: 'Rahul Kumar (235UCS052)',
    reportedDate: '15/03/2024',
    reportedTime: '10:30 AM',
  },
  {
    id: 'CMP002',
    title: 'Water tap leaking in hostel washroom',
    location: 'Boys Hostel 1, Room 205',
    category: 'Plumbing',
    priority: 'Medium',
    status: 'Assigned',
    description: 'Water tap in the washroom is continuously leaking. Wasting approximately 10 liters of water per hour. Needs immediate attention.',
    reportedBy: 'Amit Sharma (235UCS045)',
    reportedDate: '15/03/2024',
    reportedTime: '2:15 PM',
    assignedTo: 'Suresh Yadav (Plumber)',
  },
  {
    id: 'CMP003',
    title: 'WiFi not working in Central Library',
    location: 'Central Library - Reading Hall',
    category: 'IT/Network',
    priority: 'High',
    status: 'In Progress',
    description: 'WiFi connection dropping frequently in Central Library. Students unable to access online resources for exam preparation.',
    reportedBy: 'Priya Sharma (235ECE023)',
    reportedDate: '14/03/2024',
    reportedTime: '11:00 AM',
    assignedTo: 'Mahesh Verma (Network Technician)',
  },
]

export const departments = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'School of Management',
  'School of Humanities',
  'School of Law',
  'School of Buddhist Studies',
  'Central Library',
  'Administration',
  'Hostel Management',
  'Sports Complex',
  'Medical Center',
]

export const vendors = [
  {
    id: 'VEN001',
    name: 'Sharma Electricals Pvt. Ltd.',
    category: 'Electrical',
    contact: '+91-9876543210',
    email: 'contact@sharmaelectricals.com',
    address: 'Greater Noida, UP',
  },
  {
    id: 'VEN002',
    name: 'Singh Plumbing Services',
    category: 'Plumbing',
    contact: '+91-9876543211',
    email: 'info@singhplumbing.com',
    address: 'Noida, UP',
  },
  {
    id: 'VEN003',
    name: 'TechnoIndia Solutions',
    category: 'IT Services',
    contact: '+91-9876543212',
    email: 'support@technoindia.com',
    address: 'Delhi NCR',
  },
  {
    id: 'VEN004',
    name: 'Clean India Services',
    category: 'Housekeeping',
    contact: '+91-9876543213',
    email: 'contact@cleanindia.com',
    address: 'Greater Noida, UP',
  },
]

export const indianStates = [
  'Uttar Pradesh',
  'Delhi',
  'Haryana',
  'Punjab',
  'Rajasthan',
  'Maharashtra',
  'Gujarat',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'Bihar',
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'Odisha',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
]

// Helper function to format Indian currency
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Helper function to format Indian phone number
export const formatIndianPhone = (phone: string): string => {
  // Remove any existing formatting
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as +91-XXXXX-XXXXX
  if (cleaned.length === 10) {
    return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
  }
  
  return phone
}

// Helper function to format Indian date
export const formatIndianDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

// Helper function to format Indian time
export const formatIndianTime = (date: Date): string => {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
