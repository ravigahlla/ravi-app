import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to Raviflo</h1>
        <button 
          onClick={login}
          className="login-button"
        >
          Log In
        </button>
      </div>
    </div>
  )
} 