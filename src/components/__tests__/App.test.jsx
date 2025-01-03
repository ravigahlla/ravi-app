import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider } from '../../contexts/AuthContext'
import { useAuth } from '../../contexts/AuthContext'
import App from '../../App'

// Mock Auth0 context
jest.mock('../../contexts/AuthContext')

describe('App', () => {
  beforeEach(() => {
    // Mock the auth context for each test
    useAuth.mockReturnValue({
      user: {
        name: 'Test User',
        email: 'test@example.com'
      },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn()
    })
  })

  it('renders main components', () => {
    render(<App />)
    expect(screen.getByText('Raviflo')).toBeInTheDocument()
  })

  // ... other tests
}) 