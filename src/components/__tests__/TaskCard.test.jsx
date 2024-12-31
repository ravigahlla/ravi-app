import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from '../TaskCard'

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    name: 'Test Task',
    isComplete: false,
    projectIds: []
  }

  const mockProjects = []
  const mockToggleComplete = jest.fn()
  const mockOnClick = jest.fn()

  it('renders task name correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        projects={mockProjects}
        onToggleComplete={mockToggleComplete}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('calls onToggleComplete when checkbox is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        projects={mockProjects}
        onToggleComplete={mockToggleComplete}
        onClick={mockOnClick}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(mockToggleComplete).toHaveBeenCalledWith(mockTask.id)
  })
}) 