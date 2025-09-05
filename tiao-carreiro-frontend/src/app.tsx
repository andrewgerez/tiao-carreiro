import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'

import { queryClient } from './lib/query-client'
import { theme } from './theme'
import { ProtectedRoute } from './components/auth/protected-route'
import { Header } from './components/features/header'
import { ROUTES } from './constants'

import Home from './pages/home'
import SuggestMusic from './pages/suggest-music'
import Login from './pages/login'
import Register from './pages/register'
import Admin from './pages/admin'
import { AuthProvider } from './providers/auth-provider'

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <Header />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  minHeight: 'calc(100vh - 64px)',
                }}
              >
                <Routes>
                  <Route path={ROUTES.home} element={<Home />} />
                  <Route path={ROUTES.suggest} element={<SuggestMusic />} />
                  <Route path={ROUTES.login} element={<Login />} />
                  <Route path={ROUTES.register} element={<Register />} />
                  <Route 
                    path={ROUTES.admin} 
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Box>
            </Box>
          </Router>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
