import { render, screen, fireEvent } from '@testing-library/react'
import TaskDetails from './TaskDetails'
import { useAuth } from '../contexts/AuthContext'

jest.mock('../contexts/AuthContext')

describe('TaskDetails', () => {
  const mockTask = {
    id: '1',
    name: 'Test Task',
    notes: 'Test Notes',
    subTasks: [],
    column: 'Todo',
    projectIds: []
  }

  const mockProjects = [{
    id: '1',
    name: 'Test Project',
    color: '#000000'
  }]

  const mockProps = {
    task: mockTask,
    onClose: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
    projects: mockProjects,
    onAddToProject: jest.fn(),
    onToggleComplete: jest.fn()
  }

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { name: 'Test User' },
      isAuthenticated: true
    })
  })

  it('renders task details correctly', () => {
    render(<TaskDetails {...mockProps} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add notes...')).toHaveValue('Test Notes')
  })

  it('handles project operations correctly', () => {
    render(<TaskDetails {...mockProps} />)
    
    const projectsSection = screen.getByTestId('project-tags-section')
    expect(projectsSection).toBeInTheDocument()
    
    const addProjectButton = screen.getByTestId('add-project-button')
    fireEvent.click(addProjectButton)
    
    const projectOption = screen.getByText('Test Project')
    fireEvent.click(projectOption)
    
    expect(mockProps.onAddToProject).toHaveBeenCalledWith(mockTask.id, mockProjects[0].id)
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