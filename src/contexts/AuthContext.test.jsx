import { render, screen, waitFor } from '@testing-library/react'
import { useAuth0 } from '@auth0/auth0-react'
import { AuthProvider, useAuth } from './AuthContext'

jest.mock('@auth0/auth0-react')

const TestComponent = () => {
  const { user, isAuthenticated } = useAuth()
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      {user && <div data-testid="user-name">{user.name}</div>}
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides authentication status correctly', async () => {
    const mockAuth0 = {
      isAuthenticated: false,
      user: null,
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      getAccessTokenSilently: jest.fn().mockResolvedValue(null)
    }

    useAuth0.mockReturnValue(mockAuth0)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
    })
  })

  it('provides user data when authenticated', async () => {
    const mockAuth0 = {
      isAuthenticated: true,
      user: { name: 'Test User' },
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      getAccessTokenSilently: jest.fn().mockResolvedValue('test-token')
    }

    useAuth0.mockReturnValue(mockAuth0)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
    })
  })

  it('handles login correctly', async () => {
    const mockAuth0 = {
      isAuthenticated: false,
      user: null,
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      getAccessTokenSilently: jest.fn().mockResolvedValue(null)
    }

    useAuth0.mockReturnValue(mockAuth0)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
    })
  })

  it('handles logout correctly', async () => {
    const mockAuth0 = {
      isAuthenticated: true,
      user: { name: 'Test User' },
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      getAccessTokenSilently: jest.fn().mockResolvedValue('test-token')
    }

    useAuth0.mockReturnValue(mockAuth0)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    })
  })
}) 