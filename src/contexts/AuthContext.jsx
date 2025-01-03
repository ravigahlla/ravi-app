import { createContext, useContext, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0()

  const login = useCallback(() => {
    loginWithRedirect()
  }, [loginWithRedirect])

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    getAccessToken: getAccessTokenSilently
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 