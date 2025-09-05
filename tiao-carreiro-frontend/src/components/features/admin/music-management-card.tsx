import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material'
import {
  Check,
  Close,
  MoreVert,
  Edit,
  Delete,
  OpenInNew
} from '@mui/icons-material'
import type { Music, MusicStatus } from '../../../@types/music'

interface MusicManagementCardProps {
  music: Music
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onEdit: (music: Music) => void
  onDelete: (id: number) => void
  isLoading?: boolean
}

const getStatusConfig = (status: MusicStatus) => {
  switch (status) {
    case 'approved':
      return { color: 'success' as const, label: 'Aprovada' }
    case 'pending':
      return { color: 'warning' as const, label: 'Pendente' }
    case 'rejected':
      return { color: 'error' as const, label: 'Rejeitada' }
  }
}

export const MusicManagementCard: React.FC<MusicManagementCardProps> = ({
  music,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleEdit = () => {
    onEdit(music)
    handleMenuClose()
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta música?')) {
      onDelete(music.id)
    }
    handleMenuClose()
  }

  const statusConfig = getStatusConfig(music.status)

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={music.thumbnail || '/placeholder-music.jpg'}
          alt={music.title}
          sx={{ objectFit: 'cover' }}
        />

        <Chip
          label={statusConfig.label}
          color={statusConfig.color}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
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

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {music.formatted_views} visualizações
        </Typography>

        {music.duration && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Duração: {music.duration}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          Criado em: {new Date(music.created_at).toLocaleDateString('pt-BR')}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {music.status === 'pending' && (
            <>
              <Button
                size="small"
                color="success"
                variant="contained"
                startIcon={<Check />}
                onClick={() => onApprove(music.id)}
                disabled={isLoading}
              >
                Aprovar
              </Button>

              <Button
                size="small"
                color="error"
                variant="outlined"
                startIcon={<Close />}
                onClick={() => onReject(music.id)}
                disabled={isLoading}
              >
                Rejeitar
              </Button>
            </>
          )}

          <Button
            size="small"
            variant="outlined"
            startIcon={<OpenInNew />}
            href={music.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube
          </Button>
        </Box>

        <IconButton
          onClick={handleMenuOpen}
          disabled={isLoading}
          aria-label="mais opções"
        >
          <MoreVert />
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Excluir</ListItemText>
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  )
}
