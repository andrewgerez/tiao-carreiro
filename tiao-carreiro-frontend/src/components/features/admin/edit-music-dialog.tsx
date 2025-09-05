import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Music, MusicStatus } from '../../../@types/music'
import { updateMusicSchema, type UpdateMusicFormData } from '../../../validations/music'

interface EditMusicDialogProps {
  open: boolean
  music: Music | null
  onClose: () => void
  onSave: (id: number, data: UpdateMusicFormData) => void
  isLoading?: boolean
}

const statusOptions: Array<{ value: MusicStatus; label: string }> = [
  { value: 'pending', label: 'Pendente' },
  { value: 'approved', label: 'Aprovada' },
  { value: 'rejected', label: 'Rejeitada' },
]

export const EditMusicDialog: React.FC<EditMusicDialogProps> = ({
  open,
  music,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateMusicFormData>({
    resolver: zodResolver(updateMusicSchema),
    defaultValues: {
      status: music?.status || 'pending',
      youtube_url: music?.youtube_url || '',
    },
  })

  React.useEffect(() => {
    if (music) {
      reset({
        status: music.status,
        youtube_url: music.youtube_url,
      })
    }
  }, [music, reset])

  const onSubmit = (data: UpdateMusicFormData) => {
    if (music) {
      onSave(music.id, data)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Editar Música
      </DialogTitle>

      <DialogContent>
        <Box component="form" sx={{ pt: 1 }}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Status"
                error={!!errors.status}
                helperText={errors.status?.message}
                margin="normal"
                disabled={isLoading}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="youtube_url"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="URL do YouTube"
                error={!!errors.youtube_url}
                helperText={errors.youtube_url?.message}
                margin="normal"
                disabled={isLoading}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isLoading || !isDirty}
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
