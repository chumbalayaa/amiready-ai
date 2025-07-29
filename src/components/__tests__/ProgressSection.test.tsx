import { render, screen } from '@testing-library/react'
import { ProgressSection } from '../ProgressSection'

describe('ProgressSection', () => {
  const mockSteps = [
    { key: 'fetch', label: 'Fetching OpenAPI specification...', status: 'complete' as const },
    { key: 'parse', label: 'Parsing specification...', status: 'in_progress' as const },
    { key: 'validate', label: 'Validating OpenAPI version...', status: 'pending' as const },
  ]

  it('should render progress section with title', () => {
    render(<ProgressSection steps={mockSteps} progress={50} />)

    expect(screen.getByText('Analysis Progress')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should display current step in progress bar', () => {
    render(<ProgressSection steps={mockSteps} progress={50} currentStep="Parsing specification..." />)

    // Check that the current step appears in the progress header
    const progressHeaders = screen.getAllByText('Parsing specification...')
    expect(progressHeaders).toHaveLength(2) // One in header, one in step list
  })

  it('should render all steps with correct status', () => {
    render(<ProgressSection steps={mockSteps} progress={50} />)

    expect(screen.getByText('Fetching OpenAPI specification...')).toBeInTheDocument()
    expect(screen.getAllByText('Parsing specification...')).toHaveLength(2) // Appears in header and step list
    expect(screen.getByText('Validating OpenAPI version...')).toBeInTheDocument()
  })

  it('should show progress bar with correct width', () => {
    render(<ProgressSection steps={mockSteps} progress={75} />)

    const progressBar = screen.getByRole('progressbar', { hidden: true })
    expect(progressBar).toHaveStyle({ width: '75%' })
  })
}) 