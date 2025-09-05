import { render, screen, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import SuggestMusic from '../suggest-music'
import { describe, expect, it } from 'vitest'

describe('SuggestMusic Page', () => {
  it('renders form elements', () => {
    render(<SuggestMusic />)

    expect(screen.getByText('Sugerir Nova Música')).toBeInTheDocument()
    expect(screen.getByLabelText('URL do YouTube')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sugerir música/i })).toBeInTheDocument()
  })

  it('shows validation error for invalid URL', async () => {
    const user = userEvent.setup()
    render(<SuggestMusic />)

    const input = screen.getByLabelText('URL do YouTube')
    const submitButton = screen.getByRole('button', { name: /sugerir música/i })

    await user.type(input, 'invalid-url')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/deve ser uma url válida do youtube/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for non-YouTube URL', async () => {
    const user = userEvent.setup()
    render(<SuggestMusic />)

    const input = screen.getByLabelText('URL do YouTube')
    const submitButton = screen.getByRole('button', { name: /sugerir música/i })

    await user.type(input, 'https://example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/deve ser uma url válida do youtube/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid YouTube URL', async () => {
    const user = userEvent.setup()
    render(<SuggestMusic />)

    const input = screen.getByLabelText('URL do YouTube')
    const submitButton = screen.getByRole('button', { name: /sugerir música/i })

    await user.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/música sugerida com sucesso/i)).toBeInTheDocument()
    })
  })

  it('displays instructions', () => {
    render(<SuggestMusic />)

    expect(screen.getByText('📝 Como sugerir:')).toBeInTheDocument()
    expect(screen.getByText('Procure a música no YouTube')).toBeInTheDocument()
    expect(screen.getByText('Copie a URL completa da página')).toBeInTheDocument()
  })
})
