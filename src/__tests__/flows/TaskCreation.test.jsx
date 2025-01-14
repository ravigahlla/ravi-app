import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { AuthProvider } from '../../contexts/AuthContext'
import App from '../../App'
import { mockToast } from '../../setupTests'
import { api } from '../../services/api'
import mongoose from 'mongoose'

describe('Task Creation Flow', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('allows creating tasks from the header', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )

    // Find task form in header
    const headerTaskForm = screen.getByTestId('header-task-form')
    expect(headerTaskForm).toBeInTheDocument()

    // Create a new task
    const taskInput = within(headerTaskForm).getByPlaceholderText(/new task/i)
    fireEvent.change(taskInput, { target: { value: 'Test Task' } })
    fireEvent.submit(headerTaskForm)

    // Verify task was created
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    // Verify success toast
    expect(mockToast.success).toHaveBeenCalledWith('Task created')
  })

  it('prevents creating empty tasks', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )

    const headerTaskForm = screen.getByTestId('header-task-form')
    fireEvent.submit(headerTaskForm)

    // Verify error toast
    expect(mockToast.error).toHaveBeenCalledWith('Task name cannot be empty')
  })

  // Add test for input styling
  it('renders task input with correct styling', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )

    const taskInput = screen.getByPlaceholderText(/new task/i)
    expect(taskInput).toHaveClass('header-task-input')
    
    // Verify the input has a border by default
    const computedStyle = window.getComputedStyle(taskInput)
    expect(computedStyle.border).toBeTruthy()
  })

  it('creates a new task', async () => {
    // Mock API response for task creation
    api.createTask.mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Test Task',
      column: 'Todo',
      isComplete: false,
      previousColumn: 'Todo',
      notes: '',
      subTasks: [],
      projectId: null,
      userId: 'test-user-id'
    });

    render(<App />);
    
    // ... rest of test
  });

  it('handles task creation errors', async () => {
    // Mock API failure
    api.createTask.mockRejectedValueOnce(new Error('Failed to create task'));

    render(<App />);
    
    // ... rest of test
  });
}) 