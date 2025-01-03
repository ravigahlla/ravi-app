export const useAuth0 = jest.fn(() => ({
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
}))

export const Auth0Provider = ({ children }) => children 