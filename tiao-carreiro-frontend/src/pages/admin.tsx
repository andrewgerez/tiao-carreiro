import React, { useState } from 'react'
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  Alert,
  Paper,
  Chip,
} from '@mui/material'
import {
  usePendingMusic,
  useApproveMusic,
  useRejectMusic,
  useUpdateMusic,
  useDeleteMusic,
} from '../hooks/queries/use-music-queries'
import { MusicManagementCard } from '../components/features/admin/music-management-card'
import { EditMusicDialog } from '../components/features/admin/edit-music-dialog'
import { LoadingSpinner } from '../components/ui/loading-spinner'
import { ErrorAlert } from '../components/ui/error-alert'
import { SuccessAlert } from '../components/ui/success-alert'
import type { Music } from '../@types/music'
import type { UpdateMusicFormData } from '../validations/music'
import { getErrorMessage } from '../utils/errors'
import { useAuth } from '../hooks/queries/use-auth'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const Admin: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [tabValue, setTabValue] = useState(0)
  const [editDialog, setEditDialog] = useState<{
    open: boolean
    music: Music | null
  }>({ open: false, music: null })
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Queries and Mutations
  const {
    data: pendingData,
    isLoading: isLoadingPending,
    error: pendingError,
  } = usePendingMusic()

  const approveMutation = useApproveMusic()
  const rejectMutation = useRejectMusic()
  const updateMutation = useUpdateMusic()
  const deleteMutation = useDeleteMusic()

  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync(id)
      setSuccessMessage('Música aprovada com sucesso!')
    } catch (error) {
      console.error('Error approving music:', error)
    }
  }

  const handleReject = async (id: number) => {
    try {
      await rejectMutation.mutateAsync(id)
      setSuccessMessage('Música rejeitada com sucesso!')
    } catch (error) {
      console.error('Error rejecting music:', error)
    }
  }

  const handleEdit = (music: Music) => {
    setEditDialog({ open: true, music })
  }

  const handleSaveEdit = async (id: number, data: UpdateMusicFormData) => {
    try {
      await updateMutation.mutateAsync({ id, data })
      setSuccessMessage('Música atualizada com sucesso!')
      setEditDialog({ open: false, music: null })
    } catch (error) {
      console.error('Error updating music:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      setSuccessMessage('Música excluída com sucesso!')
    } catch (error) {
      console.error('Error deleting music:', error)
    }
  }

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, music: null })
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Você precisa estar logado para acessar esta página.
        </Alert>
      </Container>
    )
  }

  const pendingSongs = pendingData?.data || []
  const isLoading = isLoadingPending

  // Check for any ongoing mutations
  const isMutating =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  // Get error from any mutation
  const mutationError =
    approveMutation.error ||
    rejectMutation.error ||
    updateMutation.error ||
    deleteMutation.error

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary.main">
          Painel Administrativo
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          Bem-vindo, <strong>{user?.name}</strong>!
        </Typography>
      </Paper>

      {/* Alerts */}
      <SuccessAlert message={successMessage} sx={{ mb: 3 }} />

      <ErrorAlert
        error={pendingError ? getErrorMessage(pendingError) : null}
        sx={{ mb: 3 }}
      />

      <ErrorAlert
        error={mutationError ? getErrorMessage(mutationError) : null}
        sx={{ mb: 3 }}
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Músicas Pendentes
                {pendingSongs.length > 0 && (
                  <Chip
                    label={pendingSongs.length}
                    size="small"
                    color="warning"
                  />
                )}
              </Box>
            }
            id="admin-tab-0"
            aria-controls="admin-tabpanel-0"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {isLoading ? (
          <LoadingSpinner />
        ) : pendingSongs.length > 0 ? (
          <Grid container spacing={3}>
            {pendingSongs.map((music) => (
              <Grid item xs={12} sm={6} md={4} key={music.id}>
                <MusicManagementCard
                  music={music}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isLoading={isMutating}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            Não há músicas pendentes para aprovação no momento.
          </Alert>
        )}
      </TabPanel>

      {/* Edit Dialog */}
      <EditMusicDialog
        open={editDialog.open}
        music={editDialog.music}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
        isLoading={updateMutation.isPending}
      />
    </Container>
  )
}

export default Admin
