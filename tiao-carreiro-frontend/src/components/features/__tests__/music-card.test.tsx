import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { MusicCard } from '../music-card'
import { render, screen, createMockMusic } from '../../../test/utils'

describe('MusicCard', () => {
  const mockMusic = createMockMusic()

  it('renders music information correctly', () => {
    render(<MusicCard music={mockMusic} />)

    expect(screen.getByText(mockMusic.title)).toBeInTheDocument()
    expect(screen.getByText(`${mockMusic.formatted_views} visualizações`)).toBeInTheDocument()
    expect(screen.getByText(`Duração: ${mockMusic.duration}`)).toBeInTheDocument()
  })

  it('displays ranking when provided', () => {
    render(<MusicCard music={mockMusic} ranking={1} />)

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows status chip when showStatus is true', () => {
    render(<MusicCard music={mockMusic} showStatus />)

    expect(screen.getByText('Aprovada')).toBeInTheDocument()
  })

  it('opens YouTube URL when play button is clicked', async () => {
    const user = userEvent.setup()
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(<MusicCard music={mockMusic} />)

    const playButton = screen.getByLabelText(`Assistir ${mockMusic.title} no YouTube`)
    await user.click(playButton)

    expect(windowOpenSpy).toHaveBeenCalledWith(
      mockMusic.youtube_url,
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('displays correct status colors', () => {
    const pendingMusic = createMockMusic({ status: 'pending' })
    const { rerender } = render(<MusicCard music={pendingMusic} showStatus />)

    expect(screen.getByText('Pendente')).toBeInTheDocument()

    const rejectedMusic = createMockMusic({ status: 'rejected' })
    rerender(<MusicCard music={rejectedMusic} showStatus />)

    expect(screen.getByText('Rejeitada')).toBeInTheDocument()
  })
})
