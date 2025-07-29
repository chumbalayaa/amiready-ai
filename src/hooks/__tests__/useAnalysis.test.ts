import { renderHook, act, waitFor } from '@testing-library/react'
import { useAnalysis } from '../useAnalysis'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('useAnalysis', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useAnalysis())

    expect(result.current.isAnalyzing).toBe(false)
    expect(result.current.progress).toBe(0)
    expect(result.current.currentStep).toBe('')
    expect(result.current.results).toBe(null)
    expect(result.current.steps).toHaveLength(7)
  })

  it('should handle analysis without API key', async () => {
    const mockResults = {
      id: 'test-id',
      spectralResults: { errors: [], warnings: [], info: [] },
      aiReadinessScores: [
        {
          path: '/test',
          method: 'GET',
          score: 85,
          summary: 'Test endpoint',
          suggestions: ['Add error responses']
        }
      ],
      suggestions: [],
      timestamp: '2024-01-01T00:00:00.000Z'
    }

    // Mock streaming response
    const mockStreamData = `data: ${JSON.stringify({ type: "complete", results: mockResults })}\n\n`;
    const mockReader = {
      read: jest.fn()
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(mockStreamData) })
        .mockResolvedValueOnce({ done: true, value: undefined })
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => mockReader
      }
    })

    const { result } = renderHook(() => useAnalysis())

    const formData = new FormData()
    formData.append('url', 'https://example.com/openapi.json')

    await act(async () => {
      result.current.analyze(formData)
    })

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
      expect(result.current.results).toEqual(mockResults)
      expect(result.current.progress).toBe(100)
    })
  })

  it('should handle analysis with API key', async () => {
    const mockResults = {
      id: 'test-id',
      spectralResults: { errors: [], warnings: [], info: [] },
      aiReadinessScores: [
        {
          path: '/test',
          method: 'GET',
          score: 90,
          summary: 'Test endpoint',
          suggestions: ['Add error responses']
        }
      ],
      suggestions: ['AI suggestion 1', 'AI suggestion 2'],
      timestamp: '2024-01-01T00:00:00.000Z'
    }

    // Mock streaming response
    const mockStreamData = `data: ${JSON.stringify({ type: "complete", results: mockResults })}\n\n`;
    const mockReader = {
      read: jest.fn()
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(mockStreamData) })
        .mockResolvedValueOnce({ done: true, value: undefined })
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => mockReader
      }
    })

    const { result } = renderHook(() => useAnalysis())

    const formData = new FormData()
    formData.append('url', 'https://example.com/openapi.json')
    formData.append('apiKey', 'test-api-key')

    await act(async () => {
      result.current.analyze(formData)
    })

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
      expect(result.current.results).toEqual(mockResults)
      expect(result.current.results?.suggestions).toHaveLength(2)
    })
  })

  it('should handle analysis errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAnalysis())

    const formData = new FormData()
    formData.append('url', 'https://example.com/openapi.json')

    await act(async () => {
      result.current.analyze(formData)
    })

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
      expect(result.current.results).toBe(null)
    })
  })

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useAnalysis())

    // Set some state
    act(() => {
      result.current.reset()
    })

    expect(result.current.isAnalyzing).toBe(false)
    expect(result.current.progress).toBe(0)
    expect(result.current.currentStep).toBe('')
    expect(result.current.results).toBe(null)
  })
}) 