import { render, screen, fireEvent } from '@testing-library/react'
import ClientCard from '@/components/ClientCard'

const mockClient = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234',
  dateOfBirth: '1990-01-01',
  goals: 'Build muscle and lose weight',
  notes: 'Has knee injury',
  createdAt: '2024-01-01T00:00:00.000Z',
  _count: {
    workouts: 5,
    measurements: 3
  }
}

describe('ClientCard', () => {
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()
  const mockOnViewDetails = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders client information correctly', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('555-1234')).toBeInTheDocument()
    expect(screen.getByText('Build muscle and lose weight')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows action buttons on hover', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onViewDetails={mockOnViewDetails}
      />
    )

    const editButton = screen.getByTitle('Edit Client')
    const deleteButton = screen.getByTitle('Delete Client')
    const viewButton = screen.getByTitle('View Details')

    expect(editButton).toBeInTheDocument()
    expect(deleteButton).toBeInTheDocument()
    expect(viewButton).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onViewDetails={mockOnViewDetails}
      />
    )

    fireEvent.click(screen.getByTitle('Edit Client'))
    expect(mockOnEdit).toHaveBeenCalledWith(mockClient)
  })

  it('shows delete confirmation dialog when delete button is clicked', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onViewDetails={mockOnViewDetails}
      />
    )

    fireEvent.click(screen.getByTitle('Delete Client'))
    expect(screen.getByRole('button', { name: 'Delete Client' })).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
  })

  it('calls onViewDetails when view details button is clicked', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onViewDetails={mockOnViewDetails}
      />
    )

    fireEvent.click(screen.getByTitle('View Details'))
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockClient.id)
  })
})