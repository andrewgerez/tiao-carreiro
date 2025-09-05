import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { musicService } from '../../services/music.service'
import type { QueryParams } from '../../@types/api'
import type { Music } from '../../@types/music'

export const MUSIC_QUERY_KEYS = {
  all: ['music'] as const,
  top5: () => [...MUSIC_QUERY_KEYS.all, 'top5'] as const,
  remaining: (params: QueryParams) => [...MUSIC_QUERY_KEYS.all, 'remaining', params] as const,
  pending: () => [...MUSIC_QUERY_KEYS.all, 'pending'] as const,
} as const

export const useTop5Music = () => {
  return useQuery({
    queryKey: MUSIC_QUERY_KEYS.top5(),
    queryFn: musicService.getTop5,
  })
}

export const useRemainingMusic = (params: QueryParams = {}) => {
  return useQuery({
    queryKey: MUSIC_QUERY_KEYS.remaining(params),
    queryFn: () => musicService.getRemaining(params)
  })
}

export const usePendingMusic = () => {
  return useQuery({
    queryKey: MUSIC_QUERY_KEYS.pending(),
    queryFn: musicService.getPendingSongs,
  })
}

export const useSuggestMusic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: musicService.submitSuggestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUSIC_QUERY_KEYS.pending() })
    },
  })
}

export const useApproveMusic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: musicService.approveSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUSIC_QUERY_KEYS.all })
    },
  })
}

export const useRejectMusic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: musicService.rejectSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUSIC_QUERY_KEYS.pending() })
    },
  })
}

export const useUpdateMusic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Music> }) =>
      musicService.updateSong(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUSIC_QUERY_KEYS.all })
    },
  })
}

export const useDeleteMusic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: musicService.deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUSIC_QUERY_KEYS.all })
    },
  })
}
