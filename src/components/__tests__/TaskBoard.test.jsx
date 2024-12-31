import { render, screen, fireEvent } from '@testing-library/react'
import TaskBoard from '../TaskBoard'

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => 
    children({
      draggableProps: {},
      innerRef: jest.fn(),
      droppableProps: {},
      placeholder: null,
      snapshot: {
        isDraggingOver: false,
        draggingFromThisWith: null,
        draggingOverWith: null,
        isUsingPlaceholder: false
      }
    }),
  Draggable: ({ children }) => 
    children({
      draggableProps: {},
      innerRef: jest.fn(),
      dragHandleProps: {},
      snapshot: {
        isDragging: false,
        draggingOver: null
      }
    }, {
      isDragging: false,
      draggingOver: null
    }),
}))

describe('TaskBoard', () => {
  const mockTasks = [
    { id: '1', name: 'Task 1', column: 'Todo', isComplete: false },
    { id: '2', name: 'Task 2', column: 'Done', isComplete: true }
  ]

  const mockProps = {
    tasks: mockTasks,
    projects: [],
    onToggleComplete: jest.fn(),
    onUpdateTask: jest.fn(),
    onDeleteTask: jest.fn()
  }

  it('renders all columns', () => {
    render(<TaskBoard {...mockProps} />)
    expect(screen.getByText('Todo')).toBeInTheDocument()
    expect(screen.getByText('Now')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('Later')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('displays tasks in correct columns', () => {
    render(<TaskBoard {...mockProps} />)
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('shows task details when clicking a task', () => {
    render(<TaskBoard {...mockProps} />)
    const task = screen.getByText('Task 1')
    fireEvent.click(task)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
}) 