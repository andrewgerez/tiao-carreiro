import React from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/queries/use-auth-queries'
import { loginSchema, type LoginFormData } from '../validations/auth'
import { ErrorAlert } from '../components/ui/error-alert'
import { getErrorMessage } from '../utils/errors'
import { useAuth } from '../hooks/queries/use-auth'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const loginMutation = useLogin()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data)

      // Salvar dados no localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      // Atualizar contexto
      setUser(response.user)

      // Redirecionar
      navigate('/admin')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const isLoading = isSubmitting || loginMutation.isPending

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          textAlign="center"
          color="primary.main"
        >
          Login Administrativo
        </Typography>

        <ErrorAlert
          error={loginMutation.error ? getErrorMessage(loginMutation.error) : null}
          sx={{ mb: 3 }}
        />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                margin="normal"
                disabled={isLoading}
                autoComplete="email"
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Senha"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
                disabled={isLoading}
                autoComplete="current-password"
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
            size="large"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          <Box textAlign="center">
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{ textDecoration: 'none' }}
            >
              Não tem uma conta? Cadastre-se
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Login
