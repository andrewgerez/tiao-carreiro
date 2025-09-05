import { api } from '../lib/axios'
import type { 
  Music, 
  ApiResponse, 
  PaginatedResponse 
} from '../@types/music'
import type { QueryParams } from '../@types/api'

export const musicService = {
  getTop5: async (): Promise<Music[]> => {
    const response = await api.get<ApiResponse<Music[]>>('/musics/top5')
    return response.data.data
  },

  getRemaining: async (params: QueryParams = {}): Promise<PaginatedResponse<Music[]>> => {
    const response = await api.get<PaginatedResponse<Music[]>>('/musics', { params })
    return response.data
  },

  submitSuggestion: async (data: { youtube_url: string }): Promise<Music> => {
    const response = await api.post<ApiResponse<Music>>('/musics', data)
    return response.data.data
  },

  getPendingSongs: async (): Promise<PaginatedResponse<Music[]>> => {
    const response = await api.get<PaginatedResponse<Music[]>>('/admin/musics/pending')
    return response.data
  },

  approveSong: async (id: number): Promise<Music> => {
    const response = await api.patch<ApiResponse<Music>>(`/admin/musics/${id}/approve`)
    return response.data.data
  },

  rejectSong: async (id: number): Promise<Music> => {
    const response = await api.patch<ApiResponse<Music>>(`/admin/musics/${id}/reject`)
    return response.data.data
  },

  updateSong: async (id: number, data: Partial<Music>): Promise<Music> => {
    const response = await api.put<ApiResponse<Music>>(`/admin/musics/${id}`, data)
    return response.data.data
  },

  deleteSong: async (id: number): Promise<void> => {
    await api.delete(`/admin/musics/${id}`)
  },
}
