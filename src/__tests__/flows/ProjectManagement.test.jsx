import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { AuthProvider } from '../../contexts/AuthContext'
import App from '../../App'
import mongoose from 'mongoose'

// Mock Auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { sub: 'test-user-id', name: 'Test User' },
    isLoading: false
  })
}))

describe('Project Management Flow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('allows user to create and manage a project', async () => {
    const { container } = render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )

    // 1. Create a project
    const projectForm = screen.getByTestId('new-project-form')
    const projectNameInput = within(projectForm).getByPlaceholderText(/new project name/i)
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })
    fireEvent.submit(projectForm)

    // Verify project was created
    await waitFor(() => {
      const projectsList = container.querySelector('.projects-list')
      expect(within(projectsList).getByText('Test Project')).toBeInTheDocument()
    })

    // Rest of test...
  })

  it('creates a new project', async () => {
    api.createProject.mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Test Project',
      notes: '',
      color: '#6c757d',
      taskIds: [],
      userId: 'test-user-id'
    });
  });
}) 