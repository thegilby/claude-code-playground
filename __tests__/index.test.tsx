import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

describe('Home', () => {
  it('renders learn Next.js link', () => {
    render(<Home />)
    const linkElement = screen.getByText(/learn next.js/i)
    expect(linkElement).toBeInTheDocument()
  })
})