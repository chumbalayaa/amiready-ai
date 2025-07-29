import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputSection } from '../InputSection'

describe('InputSection', () => {
  const mockOnAnalyze = jest.fn()

  beforeEach(() => {
    mockOnAnalyze.mockClear()
  })

  it('should render input fields correctly', () => {
    render(<InputSection onAnalyze={mockOnAnalyze} isAnalyzing={false} />)

    expect(screen.getByLabelText(/OpenAPI Specification URL/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/OpenAI API Key/i)).toBeInTheDocument()
    expect(screen.getByText(/Analyze Specification/i)).toBeInTheDocument()
  })

  it('should handle URL input', async () => {
    const user = userEvent.setup()
    render(<InputSection onAnalyze={mockOnAnalyze} isAnalyzing={false} />)

    const urlInput = screen.getByLabelText(/OpenAPI Specification URL/i)
    await user.type(urlInput, 'https://example.com/openapi.json')

    expect(urlInput).toHaveValue('https://example.com/openapi.json')
  })

  it('should handle API key input', async () => {
    const user = userEvent.setup()
    render(<InputSection onAnalyze={mockOnAnalyze} isAnalyzing={false} />)

    const apiKeyInput = screen.getByLabelText(/OpenAI API Key/i)
    await user.type(apiKeyInput, 'test-api-key')

    expect(apiKeyInput).toHaveValue('test-api-key')
  })

  it('should call onAnalyze with form data when submitted', async () => {
    const user = userEvent.setup()
    render(<InputSection onAnalyze={mockOnAnalyze} isAnalyzing={false} />)

    const urlInput = screen.getByLabelText(/OpenAPI Specification URL/i)
    const apiKeyInput = screen.getByLabelText(/OpenAI API Key/i)
    const submitButton = screen.getByText(/Analyze Specification/i)

    await user.type(urlInput, 'https://example.com/openapi.json')
    await user.type(apiKeyInput, 'test-api-key')
    await user.click(submitButton)

    expect(mockOnAnalyze).toHaveBeenCalledTimes(1)
    const formData = mockOnAnalyze.mock.calls[0][0]
    expect(formData.get('url')).toBe('https://example.com/openapi.json')
    expect(formData.get('apiKey')).toBe('test-api-key')
  })

  it('should disable submit button when analyzing', () => {
    render(<InputSection onAnalyze={mockOnAnalyze} isAnalyzing={true} />)

    const submitButton = screen.getByText(/Analyzing/i)
    expect(submitButton).toBeDisabled()
  })

  it('should show file upload option', () => {
    render(<InputSection onAnalyze={mockOnAnalyze} isAnalyzing={false} />)

    expect(screen.getByText(/File Upload/i)).toBeInTheDocument()
  })
}) 