import { api } from '../lib/axios'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../@types/auth'
import type { ApiResponse } from '../@types/music'

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/register', data)
    return response.data
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/logout')
    return response.data
  },
}
