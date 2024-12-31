import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../../App'

// Update the mock to provide all required properties
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }) => children,
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

// Mock react-hot-toast to avoid DOM manipulation in tests
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  Toaster: () => null
}))

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders main components', () => {
    render(<App />)
    expect(screen.getByText('Task Manager')).toBeInTheDocument()
  })

  it('creates a new task', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Enter new task...')
    fireEvent.change(input, { target: { value: 'New Test Task' } })
    fireEvent.submit(input.closest('form'))
    
    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument()
    })
  })

  it('marks a task as complete', async () => {
    render(<App />)
    // Create a task first
    const input = screen.getByPlaceholderText('Enter new task...')
    fireEvent.change(input, { target: { value: 'Task to Complete' } })
    fireEvent.submit(input.closest('form'))

    await waitFor(() => {
      expect(screen.getByText('Task to Complete')).toBeInTheDocument()
    })

    // Find and click the checkbox
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    await waitFor(() => {
      expect(screen.getByText('Done')).toBeInTheDocument()
      expect(screen.getByText('Task to Complete')).toBeInTheDocument()
    })
  })
}) 