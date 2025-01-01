import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AccountDetails from './AccountDetails'
import './ProfileMenu.css'

export default function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAccountDetails, setShowAccountDetails] = useState(false)
  const { user, logout } = useAuth()
  const [avatarError, setAvatarError] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const handleImageError = () => {
    setAvatarError(true)
  }

  return (
    <div className="profile-menu-container">
      <button 
        className="profile-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {user.photoURL && !avatarError ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="profile-avatar"
            onError={handleImageError}
          />
        ) : (
          <div className="profile-avatar-placeholder">
            {user.email[0].toUpperCase()}
          </div>
        )}
      </button>

      {isMenuOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-info">
              <span className="profile-email">{user.email}</span>
            </div>
          </div>
          
          <button 
            className="menu-item"
            onClick={() => {
              setShowAccountDetails(true)
              setIsMenuOpen(false)
            }}
          >
            Account Settings
          </button>
          
          <div className="menu-divider"></div>
          
          <button 
            className="menu-item logout-item"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}

      {showAccountDetails && (
        <AccountDetails 
          onClose={() => setShowAccountDetails(false)}
        />
      )}
    </div>
  )
} 