import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTop5Music, useSuggestMusic } from '../use-music-queries'
import { describe, expect, it } from 'vitest'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useTop5Music', () => {
  it('fetches top 5 music successfully', async () => {
    const { result } = renderHook(() => useTop5Music(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toHaveLength(5)
    expect(result.current.data?.[0].title).toBe('Rei do Gado')
  })
})

describe('useSuggestMusic', () => {
  it('suggests music successfully', async () => {
    const { result } = renderHook(() => useSuggestMusic(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      youtube_url: 'https://www.youtube.com/watch?v=test',
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.title).toBe('Nova Música Sugerida')
  })
})
