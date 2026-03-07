import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 
  | 'customer' 
  | 'staff' 
  | 'technician' 
  | 'vendor' 
  | 'department_admin' 
  | 'campus_admin' 
  | 'super_admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session on mount
    const storedUser = localStorage.getItem('campus360_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock user data - replace with actual API call
    const mockUser: User = {
      id: '1',
      name: 'Priya Sharma',
      email,
      role: 'customer',
      department: 'Computer Science',
    }
    
    setUser(mockUser)
    localStorage.setItem('campus360_user', JSON.stringify(mockUser))
  }

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // Simulate API call
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
