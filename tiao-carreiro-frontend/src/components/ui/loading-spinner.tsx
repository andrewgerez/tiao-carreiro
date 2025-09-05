import React from 'react'
import { CircularProgress, Box, type BoxProps } from '@mui/material'

interface LoadingSpinnerProps extends BoxProps {
  size?: number
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  ...props
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
      {...props}
    >
      <CircularProgress size={size} />
    </Box>
  )
}
