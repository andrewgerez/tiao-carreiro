export { customRender as render }
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { AllTheProviders } from './providers'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })


export const createMockMusic = (overrides = {}) => ({
  id: 1,
  title: 'Test Music',
  youtube_url: 'https://www.youtube.com/watch?v=test',
  youtube_id: 'test',
  views: 1000000,
  formatted_views: '1M',
  duration: '3:30',
  thumbnail: 'https://img.youtube.com/vi/test/mqdefault.jpg',
  status: 'approved' as const,
  created_at: '2024-01-01T00:00:00.000000Z',
  updated_at: '2024-01-01T00:00:00.000000Z',
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00.000000Z',
  updated_at: '2024-01-01T00:00:00.000000Z',
  ...overrides,
})
