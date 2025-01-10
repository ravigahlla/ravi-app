import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { api } from '../services/api.js'
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const auth0 = useAuth0()
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (!auth0.isLoading) {
      if (!auth0.isAuthenticated) {
        setIsLoading(false)
      }
    }
  }, [auth0.isLoading, auth0.isAuthenticated])

  useEffect(() => {
    if (auth0.user) {
      loadUserData(auth0.user.sub)
    } else {
      setIsLoading(false)
    }
  }, [auth0.user])

  const loadUserData = async (userId) => {
    try {
      console.log('Loading data for user:', userId);
      const [fetchedTasks, fetchedProjects] = await Promise.all([
        api.getTasks(userId),
        api.getProjects(userId)
      ]);
      console.log('Fetched tasks:', fetchedTasks);
      console.log('Fetched projects:', fetchedProjects);
      setTasks(fetchedTasks);
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast.error('Failed to load your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    ...auth0,
    isLoading: isLoading || auth0.isLoading,
    tasks,
    projects,
    setTasks,
    setProjects
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