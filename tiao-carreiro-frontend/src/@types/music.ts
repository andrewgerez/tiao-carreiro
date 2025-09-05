export interface Music {
  id: number
  title: string
  youtube_url: string
  youtube_id: string
  views: number
  formatted_views: string
  duration: string | null
  thumbnail: string | null
  status: 'approved' | 'pending' | 'rejected'
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta
}

export type MusicStatus = Music['status']
