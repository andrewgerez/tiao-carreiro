import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import { PlayArrow, Visibility } from '@mui/icons-material'
import type { Music, MusicStatus } from '../../@types/music'

interface MusicCardProps {
  music: Music
  showStatus?: boolean
  ranking?: number
}

const getStatusConfig = (status: MusicStatus) => {
  switch (status) {
    case 'approved':
      return { color: 'success' as const, label: 'Aprovada' }
    case 'pending':
      return { color: 'warning' as const, label: 'Pendente' }
    case 'rejected':
      return { color: 'error' as const, label: 'Rejeitada' }
    default:
      return { color: 'default' as const, label: status }
  }
}

export const MusicCard: React.FC<MusicCardProps> = ({
  music,
  showStatus = false,
  ranking
}) => {
  const handlePlay = () => {
    window.open(music.youtube_url, '_blank', 'noopener,noreferrer')
  }

  const statusConfig = getStatusConfig(music.status)

  return (
    <Card sx={{ maxWidth: 345, position: 'relative', height: '100%' }}>
      {showStatus && (
        <Chip
          label={statusConfig.label}
          color={statusConfig.color}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
          }}
        />
      )}

      {ranking && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            left: -10,
            zIndex: 3,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          {ranking}
        </Box>
      )}

      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={'/fallback-audio.png'}
          alt={music.title}
          sx={{ objectFit: 'cover' }}
        />

        <Tooltip title="Assistir no YouTube">
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.9)',
              },
            }}
            onClick={handlePlay}
            aria-label={`Assistir ${music.title} no YouTube`}
          >
            <PlayArrow fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent>
        <Tooltip title={music.title}>
          <Typography
            gutterBottom
            variant="h6"
            component="h3"
            noWrap
            sx={{ mb: 2 }}
          >
            {music.title}
          </Typography>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Visibility fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {music.formatted_views} visualizações
          </Typography>
        </Box>

        {music.duration && (
          <Typography variant="body2" color="text.secondary">
            Duração: {music.duration}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
