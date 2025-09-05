import React, { useState } from 'react'
import {
  Container,
  Typography,
  Grid,
  Box,
  Divider,
  Pagination,
  Alert,
} from '@mui/material'
import { useTop5Music, useRemainingMusic } from '../hooks/queries/use-music-queries'
import { MusicCard } from '../components/features/music-card'
import { LoadingSpinner } from '../components/ui/loading-spinner'
import { ErrorAlert } from '../components/ui/error-alert'
import { getErrorMessage } from '../utils/errors'

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 6

  const {
    data: top5Songs = [],
    isLoading: isLoadingTop5,
    error: top5Error,
  } = useTop5Music()

  const {
    data: remainingData,
    isLoading: isLoadingRemaining,
    error: remainingError,
  } = useRemainingMusic({
    page: currentPage,
    per_page: perPage,
  })

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage)
  }

  if (isLoadingTop5) {
    return (
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoadingSpinner />
      </Box>
    )
  }

  const remainingSongs = remainingData?.data || []
  const totalPages = remainingData?.meta.last_page || 1

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Tião Carreiro & Pardinho
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: 'auto',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              px: 2
            }}
          >
            As melhores músicas da dupla sertaneja mais famosa do Brasil
          </Typography>
        </Box>

        <ErrorAlert
          error={top5Error ? getErrorMessage(top5Error) : null}
          sx={{ mb: 2 }}
        />

        <ErrorAlert
          error={remainingError ? getErrorMessage(remainingError) : null}
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              justifyContent: 'center',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            🏆 Top 5 Mais Ouvidas
          </Typography>

          {top5Songs.length > 0 ? (
            <Grid container spacing={3} justifyContent="center">
              {top5Songs.map((music, index) => (
                <Grid
                  item
                  key={music.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={2.4}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Box sx={{ width: '100%', maxWidth: 345 }}>
                    <MusicCard
                      music={music}
                      ranking={index + 1}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Alert severity="info" sx={{ maxWidth: 400 }}>
                Nenhuma música encontrada no top 5.
              </Alert>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 6, bgcolor: 'primary.light', opacity: 0.3 }} />

        <Box>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              justifyContent: 'center',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            🎵 Outras Músicas
          </Typography>

          {isLoadingRemaining ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <LoadingSpinner />
            </Box>
          ) : remainingSongs.length > 0 ? (
            <>
              <Grid container spacing={3} justifyContent="center">
                {remainingSongs.map((music) => (
                  <Grid
                    item
                    key={music.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Box sx={{ width: '100%', maxWidth: 345 }}>
                      <MusicCard music={music} />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontSize: '1rem',
                      }
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Alert severity="info" sx={{ maxWidth: 400 }}>
                Nenhuma música adicional encontrada.
              </Alert>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default Home
