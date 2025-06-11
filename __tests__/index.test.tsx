import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

// Mock fetch for API calls
global.fetch = jest.fn()

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('Home Page', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response)
  })

  it('renders the personal trainer dashboard', async () => {
    render(<Home />)
    
    expect(screen.getByText('Personal Trainer Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage your clients and track their progress')).toBeInTheDocument()
    expect(screen.getByText('Add Client')).toBeInTheDocument()
  })

  it('displays stat cards', async () => {
    render(<Home />)
    
    expect(screen.getByText('Total Clients')).toBeInTheDocument()
    expect(screen.getByText('Total Workouts')).toBeInTheDocument()
    expect(screen.getByText('Total Measurements')).toBeInTheDocument()
  })

  it('shows empty state when no clients exist', async () => {
    render(<Home />)
    
    // Wait for the component to render
    await screen.findByText('No clients yet')
    expect(screen.getByText('Start by adding your first client to track their progress and workouts')).toBeInTheDocument()
    expect(screen.getByText('Add Your First Client')).toBeInTheDocument()
  })
})