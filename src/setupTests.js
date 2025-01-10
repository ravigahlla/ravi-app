import '@testing-library/jest-dom'
import { useAuth0 } from '@auth0/auth0-react'
import mongoose from 'mongoose'
import { TextEncoder, TextDecoder } from 'util'

// Add mongoose to test environment
global.mongoose = mongoose

// Add TextEncoder/TextDecoder to global for MongoDB
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

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

// Mock mongoose to prevent actual database connections
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  Schema: jest.fn(),
  model: jest.fn(),
  Types: {
    ObjectId: jest.fn(id => id)
  }
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

// Mock API calls
jest.mock('./services/api', () => ({
  api: {
    getTasks: jest.fn(() => Promise.resolve([])),
    createTask: jest.fn((task) => Promise.resolve({ ...task, id: 'test-id' })),
    updateTask: jest.fn((task) => Promise.resolve(task)),
    deleteTask: jest.fn(() => Promise.resolve()),
    // Add other API mocks...
  }
}))

// Export for use in tests
export { mockToast } 