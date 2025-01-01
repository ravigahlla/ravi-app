import { createContext, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    isLoading,
    getAccessTokenSilently
  } = useAuth0()

  const login = () => {
    return loginWithRedirect()
  }

  const logout = () => {
    return auth0Logout({ returnTo: window.location.origin })
  }

  const value = {
    user: isAuthenticated ? user : null,
    login,
    logout,
    getAccessToken: getAccessTokenSilently
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
} 