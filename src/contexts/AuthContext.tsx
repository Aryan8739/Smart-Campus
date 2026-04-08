import { useState, type ReactNode } from 'react'
import { AuthContext } from './auth-store'
import type { User, UserRole } from './authTypes'

type DemoCredential = {
  email: string
  password: string
  role: UserRole
  name: string
  department?: string
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    email: 'superadmin@gbu.ac.in',
    password: 'Admin@123',
    role: 'super_admin',
    name: 'Ashish Bharti',
    department: 'Central Admin Dashboard',
  },
  {
    email: 'customer@gbu.ac.in',
    password: 'Customer@123',
    role: 'customer',
    name: 'Ritika Verma',
    department: 'Student Services',
  },
  {
    email: 'vendor@gbu.ac.in',
    password: 'Vendor@123',
    role: 'vendor',
    name: 'Neeraj Vendors Pvt Ltd',
    department: 'External Maintenance',
  },
  {
    email: 'deptadmin@gbu.ac.in',
    password: 'Dept@123',
    role: 'department_admin',
    name: 'Kavita Singh',
    department: 'Department Operations',
  },
  {
    email: 'technician@gbu.ac.in',
    password: 'Tech@123',
    role: 'technician',
    name: 'Aman Yadav',
    department: 'Field Execution Team',
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('campus360_user')
    return storedUser ? (JSON.parse(storedUser) as User) : null
  })
  const [isLoading] = useState(false)

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const normalizedEmail = email.trim().toLowerCase()
    const matchedCredential = DEMO_CREDENTIALS.find(
      (credential) =>
        credential.email.toLowerCase() === normalizedEmail && credential.password === password,
    )

    if (!matchedCredential) {
      throw new Error('Invalid login credentials')
    }

    const mockUser: User = {
      id: '1',
      name: matchedCredential.name,
      email: matchedCredential.email,
      role: matchedCredential.role,
      department: matchedCredential.department,
    }
    
    setUser(mockUser)
    localStorage.setItem('campus360_user', JSON.stringify(mockUser))
    return mockUser
  }

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    void password
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
    }
    
    setUser(newUser)
    localStorage.setItem('campus360_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('campus360_user')
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        register, 
        logout, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
