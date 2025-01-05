import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { AuthProvider } from '../../contexts/AuthContext'
import App from '../../App'
import { mockToast } from '../../setupTests'

// Mock Auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { sub: 'test-user-id', name: 'Test User' },
    isLoading: false
  })
}))

describe('Task Organization Flow', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('allows user to organize tasks through columns and projects', async () => {
    const { container } = render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )

    // Step 1: Create a project first
    const createProjectFlow = async () => {
      const projectForm = screen.getByTestId('new-project-form')
      const projectNameInput = within(projectForm).getByPlaceholderText(/new project name/i)
      fireEvent.change(projectNameInput, { target: { value: 'Work Tasks' } })
      
      fireEvent.submit(projectForm)

      // Verify project was created
      await waitFor(() => {
        const projectsList = screen.getByTestId('projects-list')
        expect(within(projectsList).getByText('Work Tasks')).toBeInTheDocument()
      })
    }
    await createProjectFlow()

    // Step 2: Create multiple tasks
    const createTaskFlow = async (taskName) => {
      const taskForm = screen.getByTestId('header-task-form')
      const taskInput = within(taskForm).getByPlaceholderText(/new task/i)
      fireEvent.change(taskInput, { target: { value: taskName } })
      
      fireEvent.submit(taskForm)
      
      // Wait for task to appear
      await waitFor(() => {
        expect(screen.getByText(taskName)).toBeInTheDocument()
      })
      return screen.getByText(taskName)
    }

    const task1 = await createTaskFlow('Important Meeting')
    const task2 = await createTaskFlow('Follow-up Email')

    // Step 3: Add tasks to project
    const addTasksToProjectFlow = async (taskElement) => {
      fireEvent.click(taskElement)
      
      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Click the "Add Project" button in the task details
      const addProjectButton = screen.getByTestId('add-project-button')
      fireEvent.click(addProjectButton)
      
      // Select project from dropdown
      await waitFor(() => {
        const projectSelector = container.querySelector('.project-selector')
        const projectOption = within(projectSelector).getByText('Work Tasks')
        fireEvent.click(projectOption)
      })
      
      // Save changes
      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)
    }

    await addTasksToProjectFlow(task1)
    await addTasksToProjectFlow(task2)
  })

  it('prevents creating duplicate projects', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )

    const projectForm = screen.getByTestId('new-project-form')
    const projectNameInput = within(projectForm).getByPlaceholderText(/new project name/i)

    // Create first project
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })
    fireEvent.submit(projectForm)

    // Verify first project was created
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    // Try to create duplicate project
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })
    fireEvent.submit(projectForm)

    // Wait for and verify error toast
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('A project with this name already exists')
    }, { timeout: 2000 })

    // Verify we still only have one project
    const projectElements = screen.getAllByText('Test Project')
    expect(projectElements).toHaveLength(1)
  })
}) 