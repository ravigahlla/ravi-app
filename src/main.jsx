import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-lh6lpe0py4ucg1tx.us.auth0.com"
    clientId="jbVItinttoxtAE4k2Ywo8ebSClbQtXn0"
    authorizationParams={{
      redirect_uri: window.location.origin + window.location.pathname,
      audience: `https://dev-lh6lpe0py4ucg1tx.us.auth0.com/api/v2/`,
      scope: "openid profile email"
    }}
    cacheLocation="localstorage"
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </Auth0Provider>
)
