import React from 'react'
import { Alert, type AlertProps } from '@mui/material'

interface SuccessAlertProps extends Omit<AlertProps, 'severity'> {
  message: string | null
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, ...props }) => {
  if (!message) return null

  return (
    <Alert severity="success" {...props}>
      {message}
    </Alert>
  )
}
