import { render, screen } from '@testing-library/react'
import { useAuth } from '../contexts/AuthContext'
import Login from './Login'

jest.mock('../contexts/AuthContext')

describe('Login', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      login: jest.fn(),
      isAuthenticated: false
    })
  })

  it('renders login button when not authenticated', () => {
    render(<Login />)
    expect(screen.getByRole('button')).toHaveTextContent(/log in/i)
  })

  it('calls login function when button is clicked', () => {
    const mockLogin = jest.fn()
    useAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false
    })

    render(<Login />)
    screen.getByRole('button').click()
    expect(mockLogin).toHaveBeenCalled()
  })

  it('does not render login button when authenticated', () => {
    useAuth.mockReturnValue({
      login: jest.fn(),
      isAuthenticated: true,
      user: { name: 'Test User' }
    })

    render(<Login />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
}) 