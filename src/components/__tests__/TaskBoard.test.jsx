import { render, screen, fireEvent } from '@testing-library/react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import TaskBoard from '../TaskBoard'

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => 
    children({
      droppableProps: {
        'data-rbd-droppable-id': 'test-id',
        'data-rbd-droppable-context-id': '1'
      },
      innerRef: jest.fn(),
      placeholder: null
    }, {
      isDraggingOver: false,
      draggingFromThisWith: null,
      draggingOverWith: null,
      isUsingPlaceholder: false
    }),
  DragDropContext: ({ children }) => children,
  Draggable: ({ children, draggableId, index }) =>
    children({
      draggableProps: {
        'data-rbd-draggable-context-id': '1',
        'data-rbd-draggable-id': draggableId,
        style: {
          transform: null
        }
      },
      innerRef: jest.fn(),
      dragHandleProps: {
        'data-rbd-drag-handle-draggable-id': draggableId,
        'data-rbd-drag-handle-context-id': '1',
        'aria-labelledby': `draggable-${draggableId}`,
        tabIndex: 0,
        draggable: false,
        onDragStart: jest.fn()
      }
    }, {
      isDragging: false,
      draggingOver: null,
      isDropAnimating: false
    }),
}))

describe('TaskBoard', () => {
  const mockProps = {
    tasks: [
      { id: '1', name: 'Task 1', column: 'Todo' },
      { id: '2', name: 'Task 2', column: 'Now' },
    ],
    projects: [],
    onTaskClick: jest.fn(),
    onToggleComplete: jest.fn(),
    onDeleteTask: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

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
    const todoColumn = screen.getByText('Todo').closest('.task-column')
    const nowColumn = screen.getByText('Now').closest('.task-column')
    
    expect(todoColumn).toHaveTextContent('Task 1')
    expect(nowColumn).toHaveTextContent('Task 2')
  })

  it('shows task details when clicking a task', () => {
    render(<TaskBoard {...mockProps} />)
    const task = screen.getByText('Task 1')
    fireEvent.click(task)
    expect(mockProps.onTaskClick).toHaveBeenCalledWith(mockProps.tasks[0])
  })

  it('handles task completion toggle', () => {
    render(<TaskBoard {...mockProps} />)
    const checkbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(checkbox)
    expect(mockProps.onToggleComplete).toHaveBeenCalledWith('1')
  })

  it('handles task deletion', () => {
    render(<TaskBoard {...mockProps} />)
    const deleteButton = screen.getAllByRole('button', { name: /×/i })[0]
    window.confirm = jest.fn(() => true)
    fireEvent.click(deleteButton)
    expect(mockProps.onDeleteTask).toHaveBeenCalledWith('1')
  })
}) 