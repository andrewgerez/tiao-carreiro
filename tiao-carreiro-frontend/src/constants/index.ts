export const APP_CONFIG = {
  name: 'Tião Carreiro & Pardinho',
  description: 'As melhores músicas da dupla sertaneja mais famosa do Brasil',
  version: '1.0.0',
} as const

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
} as const

export const STORAGE_KEYS = {
  token: 'token',
  user: 'user',
} as const

export const ROUTES = {
  home: '/',
  suggest: '/suggest',
  login: '/login',
  register: '/register',
  admin: '/admin',
} as const

export const QUERY_STALE_TIME = {
  short: 30 * 1000, // 30 seconds
  medium: 5 * 60 * 1000, // 5 minutes
  long: 30 * 60 * 1000, // 30 minutes
} as const
