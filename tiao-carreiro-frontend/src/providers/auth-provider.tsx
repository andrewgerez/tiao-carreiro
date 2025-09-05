import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '../@types/auth'
import type { AuthContextType } from '../@types/contexts'
import { AuthContext } from '../contexts/auth-context'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        clearAuth()
      }
    }
    setLoading(false)
  }, [])

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [setUser])

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    setUser,
    clearAuth,
  }), [user, loading, setUser, clearAuth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
