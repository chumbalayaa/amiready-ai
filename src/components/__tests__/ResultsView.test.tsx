import { render, screen, fireEvent } from '@testing-library/react'
import { ResultsView } from '../ResultsView'

describe('ResultsView', () => {
  const mockResults = {
    id: 'test-id',
    spectralResults: {
      errors: [],
      warnings: [],
      info: []
    },
    aiReadinessScores: [
      {
        path: '/test',
        method: 'GET',
        score: 85,
        summary: 'Test endpoint',
        suggestions: ['Add error responses', 'Add pagination']
      }
    ],
    suggestions: ['AI suggestion 1', 'AI suggestion 2'],
    timestamp: '2024-01-01T00:00:00.000Z'
  }

  const mockOnReset = jest.fn()

  beforeEach(() => {
    mockOnReset.mockClear()
  })

  it('should render analysis results title', () => {
    render(<ResultsView results={mockResults} onReset={mockOnReset} />)

    expect(screen.getByText('Analysis Results')).toBeInTheDocument()
  })

  it('should display AI readiness scores', () => {
    render(<ResultsView results={mockResults} onReset={mockOnReset} />)

    expect(screen.getByText('AI Readiness Scores')).toBeInTheDocument()
    expect(screen.getByText('/test (GET)')).toBeInTheDocument()
    expect(screen.getByText('85/100')).toBeInTheDocument()
  })

  it('should display endpoint suggestions', () => {
    render(<ResultsView results={mockResults} onReset={mockOnReset} />)

    expect(screen.getByText('Add error responses')).toBeInTheDocument()
    expect(screen.getByText('Add pagination')).toBeInTheDocument()
  })

  it('should display AI-generated suggestions', () => {
    render(<ResultsView results={mockResults} onReset={mockOnReset} />)

    expect(screen.getByText('AI-Generated Suggestions')).toBeInTheDocument()
    expect(screen.getByText('AI suggestion 1')).toBeInTheDocument()
    expect(screen.getByText('AI suggestion 2')).toBeInTheDocument()
  })

  it('should call onReset when New Analysis button is clicked', () => {
    render(<ResultsView results={mockResults} onReset={mockOnReset} />)

    const resetButton = screen.getByText('New Analysis')
    fireEvent.click(resetButton)

    expect(mockOnReset).toHaveBeenCalledTimes(1)
  })

  it('should display spectral results summary', () => {
    render(<ResultsView results={mockResults} onReset={mockOnReset} />)

    expect(screen.getByText('OpenAI Spec Linting Results')).toBeInTheDocument()
    expect(screen.getAllByText('0')).toHaveLength(3) // errors, warnings, and info counts
  })
}) 