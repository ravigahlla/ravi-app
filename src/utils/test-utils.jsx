import { render } from '@testing-library/react'
import { DragDropContext } from 'react-beautiful-dnd'
import { AuthProvider } from '../contexts/AuthContext'

const AllTheProviders = ({ children }) => {
  return (
    <AuthProvider>
      <DragDropContext onDragEnd={() => {}}>
        {children}
      </DragDropContext>
    </AuthProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render } 