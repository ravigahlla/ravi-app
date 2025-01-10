import { useAuth0 } from '@auth0/auth0-react'
import './Login.css'

function Login() {
  const { loginWithRedirect, isLoading } = useAuth0()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="login-container">
      <h1>Welcome to Raviflo</h1>
      <button 
        className="login-button"
        onClick={() => loginWithRedirect()}
      >
        Log In
      </button>
    </div>
  )
}

export default Login 