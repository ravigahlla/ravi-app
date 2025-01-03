import { render, screen, fireEvent } from '@testing-library/react'
import { useAuth } from '../contexts/AuthContext'
import ProfileMenu from './ProfileMenu'

jest.mock('../contexts/AuthContext')

describe('ProfileMenu', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    picture: 'https://example.com/avatar.jpg',
    photoURL: 'https://example.com/avatar.jpg'
  }

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
      isAuthenticated: true
    })
  })

  it('renders user avatar and name', () => {
    render(<ProfileMenu />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByAltText('Profile')).toBeInTheDocument()
  })

  it('shows dropdown menu when clicked', () => {
    render(<ProfileMenu />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Log Out')).toBeInTheDocument()
  })

  it('calls logout when logout option is clicked', () => {
    const mockLogout = jest.fn()
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isAuthenticated: true
    })

    render(<ProfileMenu />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Log Out'))
    expect(mockLogout).toHaveBeenCalled()
  })

  it('handles missing user data gracefully', () => {
    useAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      isAuthenticated: true
    })

    render(<ProfileMenu />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('U')).toBeInTheDocument()
  })
}) 