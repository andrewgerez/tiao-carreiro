export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface QueryParams {
  page?: number
  per_page?: number
  [key: string]: unknown
}
