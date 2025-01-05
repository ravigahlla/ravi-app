import '@testing-library/jest-dom'
import { useAuth0 } from '@auth0/auth0-react'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
}

// Mock Auth0 hook default values
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(() => ({
    isAuthenticated: true,
    user: {
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/picture.jpg'
    },
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
    getAccessTokenSilently: jest.fn(),
    isLoading: false
  })),
  Auth0Provider: ({ children }) => children
}))

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})

// Create mock toast functions
const mockToast = {
  error: jest.fn(),
  success: jest.fn()
}

// Mock the entire react-hot-toast module
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: mockToast,  // This is important - the default export should be the mock
  toast: mockToast
}))

// Export for use in tests
export { mockToast } 