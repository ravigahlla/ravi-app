import { render, screen, fireEvent } from '@testing-library/react'
import ProjectSidebar from '../ProjectSidebar'

describe('ProjectSidebar', () => {
  const mockProjects = [
    { id: '1', name: 'Project 1', taskIds: [], color: '#6c757d' },
    { id: '2', name: 'Project 2', taskIds: [], color: '#007bff' }
  ]

  const mockProps = {
    projects: mockProjects,
    onCreateProject: jest.fn(),
    onSelectProject: jest.fn(),
    selectedProjectId: null,
    isExpanded: true,
    onToggleExpand: jest.fn()
  }

  it('renders project list', () => {
    render(<ProjectSidebar {...mockProps} />)
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByText('Project 2')).toBeInTheDocument()
  })

  it('creates new project', () => {
    render(<ProjectSidebar {...mockProps} />)
    const createButton = screen.getByRole('button', { name: 'Create' })
    fireEvent.click(createButton)
    
    // Verify project creation form is active
    expect(screen.getByPlaceholderText('New project name...')).toBeInTheDocument()
  })

  it('toggles sidebar expansion', () => {
    render(<ProjectSidebar {...mockProps} />)
    const toggleButton = screen.getByRole('button', { name: '◀' })
    fireEvent.click(toggleButton)
    expect(mockProps.onToggleExpand).toHaveBeenCalled()
  })
}) 