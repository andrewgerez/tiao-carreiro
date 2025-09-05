import React from 'react'
import { Alert, type AlertProps } from '@mui/material'

interface ErrorAlertProps extends Omit<AlertProps, 'severity'> {
  error: string | null
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, ...props }) => {
  if (!error) return null

  return (
    <Alert severity="error" {...props}>
      {error}
    </Alert>
  )
}
