import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import Home from '../home'

describe('Home Page', () => {
  it('renders page title and description', async () => {
    render(<Home />)

    expect(screen.getByText('Tião Carreiro & Pardinho')).toBeInTheDocument()
    expect(screen.getByText('As melhores músicas da dupla sertaneja mais famosa do Brasil')).toBeInTheDocument()
  })

  it('displays top 5 section', async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('🏆 Top 5 Mais Ouvidas')).toBeInTheDocument()
    })
  })

  it('displays other musics section', async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('🎵 Outras Músicas')).toBeInTheDocument()
    })
  })

  it('shows loading spinner initially', () => {
    render(<Home />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays music cards when data loads', async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Rei do Gado')).toBeInTheDocument()
      expect(screen.getByText('Pagode em Brasília')).toBeInTheDocument()
    })
  })
})
