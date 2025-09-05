import { z } from 'zod'

const youtubeUrlRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//

export const suggestMusicSchema = z.object({
  youtube_url: z
    .string()
    .min(1, 'URL do YouTube é obrigatória')
    .url('URL deve ter um formato válido')
    .regex(youtubeUrlRegex, 'Deve ser uma URL válida do YouTube'),
})

export const updateMusicSchema = z.object({
  status: z.enum(['approved', 'pending', 'rejected']).optional(),
  youtube_url: z
    .string()
    .url('URL deve ter um formato válida')
    .regex(youtubeUrlRegex, 'Deve ser uma URL válida do YouTube')
    .optional(),
})

export type SuggestMusicFormData = z.infer<typeof suggestMusicSchema>
export type UpdateMusicFormData = z.infer<typeof updateMusicSchema>
