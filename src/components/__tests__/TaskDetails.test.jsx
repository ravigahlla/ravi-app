import { render, screen, fireEvent } from '@testing-library/react'
import TaskDetails from '../TaskDetails'

describe('TaskDetails', () => {
  const mockTask = {
    id: '1',
    name: 'Test Task',
    notes: 'Test Notes',
    subTasks: [],
    isComplete: false,
    projectIds: []
  }

  const mockProps = {
    task: mockTask,
    projects: [],
    onClose: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
    onToggleComplete: jest.fn()
  }

  it('renders task details correctly', () => {
    render(<TaskDetails {...mockProps} />)
    
    expect(screen.getByText(mockTask.name)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add notes...')).toHaveValue(mockTask.notes)
  })

  it('handles task completion toggle', () => {
    render(<TaskDetails {...mockProps} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(mockProps.onToggleComplete).toHaveBeenCalledWith(mockTask.id)
  })

  it('confirms before deleting task', () => {
    window.confirm = jest.fn(() => true)
    render(<TaskDetails {...mockProps} />)
    
    const deleteButton = screen.getByText('🗑')
    fireEvent.click(deleteButton)
    
    expect(window.confirm).toHaveBeenCalled()
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockTask.id)
  })
}) 