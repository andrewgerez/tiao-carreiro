import type { User } from './auth'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  setUser: (user: User | null) => void
  clearAuth: () => void
}
