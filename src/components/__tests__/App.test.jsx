import { render, screen } from '@testing-library/react'
import App from '../../App'
import { AuthProvider } from '../../contexts/AuthContext'

describe('App Component', () => {
  it('renders header with correct layout', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )

    const header = screen.getByTestId('app-header')
    expect(header).toHaveClass('app-header')

    // Verify header contains all required elements
    expect(screen.getByText('Raviflo')).toBeInTheDocument()
    expect(screen.getByTestId('header-task-form')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/new task/i)).toBeInTheDocument()
  })
}) 