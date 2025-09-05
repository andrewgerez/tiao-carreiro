import { render, screen } from '../../../test/utils'
import userEvent from '@testing-library/user-event'
import { Header } from '../header'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockNavigate = vi.fn()
const mockLogout = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../../hooks/use-auth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    clearAuth: vi.fn(),
  }),
}))

vi.mock('../../../hooks/queries/use-auth-queries', () => ({
  useLogout: () => ({
    mutateAsync: mockLogout,
    isPending: false,
  }),
}))

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders navigation links', () => {
    render(<Header />)

    expect(screen.getByText('Tião Carreiro & Pardinho')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Sugerir Música')).toBeInTheDocument()
  })

  it('shows login and register buttons when not authenticated', () => {
    render(<Header />)

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Cadastrar')).toBeInTheDocument()
  })

  it('navigates to home when title is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const title = screen.getByText('Tião Carreiro & Pardinho')
    await user.click(title)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('navigates to suggest page when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const suggestButton = screen.getByText('Sugerir Música')
    await user.click(suggestButton)

    expect(mockNavigate).toHaveBeenCalledWith('/suggest')
  })
})
