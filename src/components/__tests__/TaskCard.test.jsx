import { render, screen, fireEvent } from '@testing-library/react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import TaskCard from '../TaskCard'

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    name: 'Test Task',
    isComplete: false,
    column: 'Todo'
  }

  const mockProps = {
    task: mockTask,
    projects: [],
    index: 0,
    onToggleComplete: jest.fn(),
    onDelete: jest.fn(),
    onUpdate: jest.fn(),
    onTaskClick: jest.fn()
  }

  const renderWithDnd = (ui) => {
    return render(
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="test-droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {ui}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  it('renders task name correctly', () => {
    renderWithDnd(<TaskCard {...mockProps} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('calls onTaskClick when clicked', () => {
    renderWithDnd(<TaskCard {...mockProps} />)
    fireEvent.click(screen.getByText('Test Task'))
    expect(mockProps.onTaskClick).toHaveBeenCalledWith(mockTask)
  })
}) 