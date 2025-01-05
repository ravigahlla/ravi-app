import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { AuthProvider } from '../../contexts/AuthContext'
import App from '../../App'

// Mock Auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { sub: 'test-user-id', name: 'Test User' },
    isLoading: false
  })
}))

describe('Task Management Flow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('allows user to manage tasks with projects', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )

    // 1. Create a new task
    const taskForm = screen.getByTestId('header-task-form')
    const taskInput = within(taskForm).getByPlaceholderText(/new task/i)
    fireEvent.change(taskInput, { target: { value: 'New Test Task' } })
    fireEvent.submit(taskForm)

    // Verify task was created
    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument()
    })

    // Rest of test...
  })
}) 