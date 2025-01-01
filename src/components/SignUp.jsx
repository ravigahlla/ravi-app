import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Login.css' // We can reuse the login styles

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setIsLoading(true)
      await signup(email, password)
    } catch (err) {
      setError('Failed to create account: ' + err.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Create Account</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <a href="#" onClick={() => window.location.reload()}>Log In</a>
        </p>
      </div>
    </div>
  )
} 