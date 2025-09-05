import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LoadingSpinner } from '../ui/loading-spinner'
import { ROUTES } from '../../constants'
import { useAuth } from '../../hooks/queries/use-auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner sx={{ mt: 8 }} />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        state={{ from: location }}
        replace
      />
    )
  }

  return <>{children}</>
}
