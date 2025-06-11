import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ClientForm from '@/components/ClientForm'

describe('ClientForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders add client form correctly', () => {
    render(
      <ClientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Add New Client')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter client\'s full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('client@example.com')).toBeInTheDocument()
    expect(screen.getByText('Add Client')).toBeInTheDocument()
  })

  it('renders edit client form correctly when client is provided', () => {
    const client = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      dateOfBirth: '1990-01-01',
      goals: 'Build muscle',
      notes: 'Has knee injury'
    }

    render(
      <ClientForm
        client={client}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Edit Client')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Update Client')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ClientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('calls onSubmit with form data when submitted', async () => {
    render(
      <ClientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const nameInput = screen.getByPlaceholderText('Enter client\'s full name')
    const emailInput = screen.getByPlaceholderText('client@example.com')
    
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } })
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } })
    
    fireEvent.click(screen.getByText('Add Client'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '',
        dateOfBirth: '',
        goals: '',
        notes: ''
      })
    })
  })

  it('requires name field to be filled', () => {
    render(
      <ClientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const submitButton = screen.getByText('Add Client')
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when name is provided', () => {
    render(
      <ClientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const nameInput = screen.getByPlaceholderText('Enter client\'s full name')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })

    const submitButton = screen.getByText('Add Client')
    expect(submitButton).not.toBeDisabled()
  })
})