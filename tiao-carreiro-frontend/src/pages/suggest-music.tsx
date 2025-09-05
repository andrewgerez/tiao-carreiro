import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Send, CheckCircle } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuggestMusic } from '../hooks/queries/use-music-queries'
import { suggestMusicSchema, SuggestMusicFormData } from '../validations/music'
import { LoadingSpinner } from '../components/ui/loading-spinner'
import { ErrorAlert } from '../components/ui/error-alert'
import { SuccessAlert } from '../components/ui/success-alert'
import { getErrorMessage } from '../utils/errors'

const SuggestMusic: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const suggestMutation = useSuggestMusic()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SuggestMusicFormData>({
    resolver: zodResolver(suggestMusicSchema),
    defaultValues: {
      youtube_url: '',
    },
  })

  const onSubmit = async (data: SuggestMusicFormData) => {
    try {
      await suggestMutation.mutateAsync(data)
      setSuccessMessage('Música sugerida com sucesso! Aguarde a aprovação da administração.')
      reset()
    } catch (error) {
      console.error('Error suggesting music:', error)
    }
  }

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const isLoading = isSubmitting || suggestMutation.isPending

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        bgcolor: 'background.default',
        py: 4,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md" sx={{ width: '100%' }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            mx: 'auto',
            maxWidth: 800,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            textAlign="center"
            color="primary.main"
            sx={{
              mb: 2,
              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.25rem' }
            }}
          >
            Sugerir Nova Música
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
            textAlign="center"
          >
            Conhece alguma música do Tião Carreiro & Pardinho que não está em nossa lista?
            Sugira através do link do YouTube!
          </Typography>

          <SuccessAlert message={successMessage} sx={{ mb: 3 }} />

          <ErrorAlert
            error={suggestMutation.error ? getErrorMessage(suggestMutation.error) : null}
            sx={{ mb: 3 }}
          />

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="youtube_url"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="URL do YouTube"
                  placeholder="https://www.youtube.com/watch?v=..."
                  error={!!errors.youtube_url}
                  helperText={errors.youtube_url?.message || 'Cole aqui o link completo da música no YouTube'}
                  disabled={isLoading}
                  sx={{ mb: 3 }}
                />
              )}
            />

            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={isLoading ? <LoadingSpinner size={20} /> : <Send />}
                disabled={isLoading}
                sx={{ px: 4, py: 1.5 }}
              >
                {isLoading ? 'Enviando...' : 'Sugerir Música'}
              </Button>
            </Box>
          </Box>

          {/* Instructions */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📝 Como sugerir:
            </Typography>

            <List dense>
              {[
                'Procure a música no YouTube',
                'Copie a URL completa da página',
                'Cole no campo acima e clique em "Sugerir Música"',
                'Aguarde a aprovação da administração'
              ].map((step, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={step}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Paper>
      </Container>
    </Box>
  )
}

export default SuggestMusic
