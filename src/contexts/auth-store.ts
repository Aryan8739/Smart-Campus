import { createContext } from 'react'
import type { User, UserRole } from './authTypes'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role?: UserRole) => Promise<void>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
