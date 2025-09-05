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
import { useRegister } from '../hooks/queries/use-auth-queries'
import { registerSchema, type RegisterFormData } from '../validations/auth'
import { ErrorAlert } from '../components/ui/error-alert'
import { getErrorMessage } from '../utils/errors'
import { useAuth } from '../hooks/queries/use-auth'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const registerMutation = useRegister()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerMutation.mutateAsync(data)

      // Salvar dados no localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      // Atualizar contexto
      setUser(response.user)

      // Redirecionar
      navigate('/admin')
    } catch (error) {
      console.error('Register error:', error)
    }
  }

  const isLoading = isSubmitting || registerMutation.isPending

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
          Cadastro Administrativo
        </Typography>

        <ErrorAlert
          error={registerMutation.error ? getErrorMessage(registerMutation.error) : null}
          sx={{ mb: 3 }}
        />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nome"
                error={!!errors.name}
                helperText={errors.name?.message}
                margin="normal"
                disabled={isLoading}
                autoComplete="name"
              />
            )}
          />

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
                autoComplete="new-password"
              />
            )}
          />

          <Controller
            name="password_confirmation"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Confirmar Senha"
                type="password"
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation?.message}
                margin="normal"
                disabled={isLoading}
                autoComplete="new-password"
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
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>

          <Box textAlign="center">
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{ textDecoration: 'none' }}
            >
              Já tem uma conta? Faça login
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Register
