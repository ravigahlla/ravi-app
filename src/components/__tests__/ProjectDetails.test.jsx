import { render, screen, fireEvent } from '@testing-library/react'
import ProjectDetails from '../ProjectDetails'

describe('ProjectDetails', () => {
  const mockProject = {
    id: '1',
    name: 'Test Project',
    notes: 'Project Notes',
    color: '#6c757d',
    taskIds: []
  }

  const mockProps = {
    project: mockProject,
    tasks: [],
    onClose: jest.fn(),
    onUpdate: jest.fn(),
    onAddTask: jest.fn(),
    onRemoveTask: jest.fn(),
    onCreateTask: jest.fn()
  }

  it('renders project details correctly', () => {
    render(<ProjectDetails {...mockProps} />)
    
    expect(screen.getByDisplayValue(mockProject.name)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add project notes...')).toHaveValue(mockProject.notes)
  })

  it('enables save button when changes are made', () => {
    render(<ProjectDetails {...mockProps} />)
    
    const nameInput = screen.getByDisplayValue(mockProject.name)
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } })
    
    const saveButton = screen.getByText('Save')
    expect(saveButton).not.toBeDisabled()
  })
}) 