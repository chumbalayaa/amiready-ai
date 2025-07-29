import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../page'

// Mock the useAnalysis hook
jest.mock('../../hooks/useAnalysis', () => ({
  useAnalysis: () => ({
    isAnalyzing: false,
    progress: 0,
    currentStep: '',
    results: null,
    steps: [
      { key: 'fetch', label: 'Fetching...', status: 'pending' as const },
      { key: 'parse', label: 'Parsing...', status: 'pending' as const },
    ],
    analyze: jest.fn(),
    reset: jest.fn(),
  }),
}))

describe('Home Page', () => {
  it('should render the main page with title and description', () => {
    render(<Home />)

    expect(screen.getByText('API AI Readiness Checker')).toBeInTheDocument()
    expect(screen.getByText(/Is your API ready for AI agents/)).toBeInTheDocument()
  })

  it('should show input section when no results', () => {
    render(<Home />)

    expect(screen.getByText('Analyze Specification')).toBeInTheDocument()
    expect(screen.getByLabelText(/URL/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/OpenAI API Key/i)).toBeInTheDocument()
  })

  it('should not show progress section when not analyzing', () => {
    render(<Home />)

    expect(screen.queryByText('Analysis Progress')).not.toBeInTheDocument()
  })

  it('should not show results when no results', () => {
    render(<Home />)

    expect(screen.queryByText('Analysis Results')).not.toBeInTheDocument()
  })
}) 