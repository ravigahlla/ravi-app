import { render, screen, fireEvent } from '@testing-library/react'
import TaskDetails from '../TaskDetails'

describe('TaskDetails', () => {
  const mockTask = {
    id: '1',
    name: 'Test Task',
    notes: 'Test notes',
    isComplete: false,
    subTasks: [],
    projectIds: []
  }

  const mockProps = {
    task: mockTask,
    projects: [],
    onClose: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
    onToggleComplete: jest.fn(),
    onAddToProject: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders task details', () => {
    render(<TaskDetails {...mockProps} />)
    expect(screen.getByText(mockTask.name)).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('handles task completion toggle', () => {
    render(<TaskDetails {...mockProps} />)
    const checkbox = screen.getByRole('checkbox', { name: '' })
    fireEvent.click(checkbox)
    
    // Click save to apply changes
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)
    
    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      ...mockTask,
      isComplete: true,
      notes: mockTask.notes,
      subTasks: []
    })
  })

  it('confirms before deleting task', () => {
    window.confirm = jest.fn(() => true)
    render(<TaskDetails {...mockProps} />)
    const deleteButton = screen.getByRole('button', { name: /delete task/i })
    fireEvent.click(deleteButton)
    expect(window.confirm).toHaveBeenCalled()
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockTask.id)
  })

  it('shows unsaved changes warning when closing', () => {
    window.confirm = jest.fn(() => true)
    render(<TaskDetails {...mockProps} />)
    
    // Make a change
    const notesInput = screen.getByRole('textbox', { name: /notes/i })
    fireEvent.change(notesInput, { target: { value: 'New notes' } })
    
    // Try to close
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    
    expect(window.confirm).toHaveBeenCalled()
    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('saves changes when clicking save', () => {
    render(<TaskDetails {...mockProps} />)
    
    // Make a change
    const notesInput = screen.getByRole('textbox', { name: /notes/i })
    fireEvent.change(notesInput, { target: { value: 'New notes' } })
    
    // Save changes
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)
    
    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      ...mockTask,
      notes: 'New notes',
      subTasks: []
    })
  })

  it('adds subtasks correctly', () => {
    render(<TaskDetails {...mockProps} />)
    
    const input = screen.getByPlaceholderText('Add new sub-task...')
    const addButton = screen.getByTestId('add-subtask-button')
    
    fireEvent.change(input, { target: { value: 'New subtask' } })
    fireEvent.click(addButton)
    
    expect(screen.getByText('New subtask')).toBeInTheDocument()
  })
}) 