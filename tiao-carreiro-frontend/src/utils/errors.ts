import { AxiosError } from 'axios'
import type { ApiError } from '../@types/api'

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError
    
    if (apiError?.errors) {
      const firstError = Object.values(apiError.errors)[0]
      return Array.isArray(firstError) ? firstError[0] : firstError
    }
    
    return apiError?.message || error.message || 'Erro desconhecido'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'Erro desconhecido'
}

export const isApiError = (error: unknown): error is AxiosError<ApiError> => {
  return error instanceof AxiosError
}
