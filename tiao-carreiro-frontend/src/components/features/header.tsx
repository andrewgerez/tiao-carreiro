import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material'
import { AccountCircle, MusicNote, Menu as MenuIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useLogout } from '../../hooks/queries/use-auth-queries'
import { useAuth } from '../../hooks/queries/use-auth'

export const Header: React.FC = () => {
  const { user, isAuthenticated, clearAuth } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)

  const logoutMutation = useLogout()

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorEl(null)
  }

  const handleCloseMobileMenu = () => {
    setMobileMenuAnchor(null)
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      handleCloseUserMenu()
      navigate('/')
    }
  }

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Sugerir Música', path: '/suggest' },
  ]

  const authItems = isAuthenticated
    ? [{ label: 'Admin', path: '/admin' }]
    : [
      { label: 'Login', path: '/login' },
      { label: 'Cadastrar', path: '/register' },
    ]

  const NavigationButtons: React.FC = () => (
    <>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          onClick={() => navigate(item.path)}
          sx={{ mx: 0.5 }}
        >
          {item.label}
        </Button>
      ))}

      {!isAuthenticated &&
        authItems.map((item) => (
          <Button
            key={item.path}
            color="inherit"
            onClick={() => navigate(item.path)}
            sx={{ mx: 0.5 }}
          >
            {item.label}
          </Button>
        ))}
    </>
  )

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'primary.main',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1400px' }}>
        <Toolbar sx={{ px: { xs: 0, sm: 0 } }}>
          <MusicNote sx={{ mr: 2, fontSize: '2rem' }} />
          <Typography
            variant="h6"
            component="h1"
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              '&:hover': { opacity: 0.8 },
              transition: 'opacity 0.2s',
            }}
            onClick={() => navigate('/')}
          >
            Tião Carreiro & Pardinho
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleMobileMenu}
                aria-label="menu"
                size="large"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleCloseMobileMenu}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                  }
                }}
              >
                {[...navigationItems, ...authItems].map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      handleCloseMobileMenu()
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                {isAuthenticated && (
                  <MenuItem onClick={handleLogout}>
                    Sair
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NavigationButtons />

              {isAuthenticated ? (
                <>
                  <Button color="inherit" onClick={() => navigate('/admin')} sx={{ mx: 0.5 }}>
                    Admin
                  </Button>
                  <IconButton
                    size="large"
                    aria-label="conta do usuário"
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    onClick={handleUserMenu}
                    color="inherit"
                    sx={{ ml: 1 }}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="user-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                      }
                    }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2">
                        Olá, <strong>{user?.name}</strong>
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
                    </MenuItem>
                  </Menu>
                </>
              ) : null}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
