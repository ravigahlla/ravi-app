import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './AccountDetails.css'

export default function AccountDetails({ onClose }) {
  const { user, updateEmail, updatePassword, updateProfile } = useAuth()
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(user.photoURL)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password && password !== confirmPassword) {
      return setError("Passwords don't match")
    }

    try {
      setError('')
      setIsLoading(true)

      if (photo) {
        await updateProfile({ photoURL: photo })
      }

      if (email !== user.email) {
        await updateEmail(email)
      }

      if (password) {
        await updatePassword(password)
      }

      onClose()
    } catch (err) {
      setError('Failed to update account: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview !== user.photoURL) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview, user.photoURL])

  return (
    <div className="modal-overlay">
      <div className="account-details-modal">
        <h2>Account Settings</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="photo-section">
            <div className="current-photo">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" />
              ) : (
                <div className="photo-placeholder">
                  {user.email[0].toUpperCase()}
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              id="photo-upload"
              className="hidden"
            />
            <label htmlFor="photo-upload" className="upload-button">
              Change Photo
            </label>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>

          {password && (
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={isLoading}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 