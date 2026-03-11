import { useState, type ReactNode } from 'react'
import { AuthContext } from './auth-store'
import type { User, UserRole } from './authTypes'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('campus360_user')
    return storedUser ? (JSON.parse(storedUser) as User) : null
  })
  const [isLoading] = useState(false)

  const login = async (email: string, password: string) => {
    void password
    await new Promise(resolve => setTimeout(resolve, 1000))

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
