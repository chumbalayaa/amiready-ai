import { performAnalysis } from '../analysisService'

// Mock dependencies
jest.mock('../openapiParser', () => ({
  getSpecContent: jest.fn(),
  parseSpecContent: jest.fn(),
  validateOpenAPIVersion: jest.fn(),
}))

jest.mock('../aiReadinessAnalyzer', () => ({
  analyzeAIReadiness: jest.fn(),
}))

jest.mock('../openaiService', () => ({
  generateOpenAISuggestions: jest.fn(),
}))

jest.mock('../resultsStore', () => ({
  storeResult: jest.fn(),
}))

describe('performAnalysis', () => {
  const mockSpec = {
    openapi: '3.0.0',
    paths: {
      '/test': {
        get: {
          summary: 'Test endpoint',
          responses: {
            '200': { description: 'Success' }
          }
        }
      }
    }
  }

  const mockAiReadinessScores = [
    {
      path: '/test',
      method: 'GET',
      score: 85,
      summary: 'Test endpoint',
      suggestions: ['Add error responses']
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mocks
    const { getSpecContent, parseSpecContent, validateOpenAPIVersion } = require('../openapiParser')
    const { analyzeAIReadiness } = require('../aiReadinessAnalyzer')
    const { generateOpenAISuggestions } = require('../openaiService')

    getSpecContent.mockResolvedValue('{"openapi": "3.0.0"}')
    parseSpecContent.mockReturnValue(mockSpec)
    validateOpenAPIVersion.mockImplementation(() => { })
    analyzeAIReadiness.mockReturnValue(mockAiReadinessScores)
    generateOpenAISuggestions.mockResolvedValue(['AI suggestion 1'])
  })

  it('should perform analysis without API key', async () => {
    const onProgress = jest.fn()

    const result = await performAnalysis({
      url: 'https://example.com/openapi.json',
      onProgress
    })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('aiReadinessScores', mockAiReadinessScores)
    expect(result).toHaveProperty('suggestions', [])
    expect(result).toHaveProperty('timestamp')

    // Check progress calls
    expect(onProgress).toHaveBeenCalledWith(15, 'Fetching OpenAPI specification...', 'fetch')
    expect(onProgress).toHaveBeenCalledWith(30, 'Parsing specification...', 'parse')
    expect(onProgress).toHaveBeenCalledWith(45, 'Validating OpenAPI version...', 'validate')
    expect(onProgress).toHaveBeenCalledWith(60, 'Analyzing spec with Spectral linting...', 'spectral')
    expect(onProgress).toHaveBeenCalledWith(75, 'Assessing AI readiness...', 'ai_readiness')
    expect(onProgress).toHaveBeenCalledWith(85, 'Skipping OpenAI suggestions (no API key)...', 'openai')
    expect(onProgress).toHaveBeenCalledWith(95, 'Finalizing and saving results...', 'finalize')
  })

  it('should perform analysis with API key', async () => {
    const onProgress = jest.fn()
    const { generateOpenAISuggestions } = require('../openaiService')

    const result = await performAnalysis({
      url: 'https://example.com/openapi.json',
      apiKey: 'test-api-key',
      onProgress
    })

    expect(result).toHaveProperty('suggestions', ['AI suggestion 1'])
    expect(generateOpenAISuggestions).toHaveBeenCalledWith(mockSpec, 'test-api-key')

    // Check OpenAI progress call
    expect(onProgress).toHaveBeenCalledWith(85, 'Generating suggestions with OpenAI...', 'openai')
  })

  it('should handle file input', async () => {
    const mockFile = new File(['{"openapi": "3.0.0"}'], 'test.json', { type: 'application/json' })
    const { getSpecContent } = require('../openapiParser')

    await performAnalysis({
      file: mockFile,
      onProgress: jest.fn()
    })

    expect(getSpecContent).toHaveBeenCalledWith(undefined, mockFile)
  })

  it('should handle errors gracefully', async () => {
    const { getSpecContent } = require('../openapiParser')
    getSpecContent.mockRejectedValue(new Error('Failed to fetch'))

    await expect(performAnalysis({
      url: 'https://example.com/openapi.json',
      onProgress: jest.fn()
    })).rejects.toThrow('Failed to fetch')
  })
}) 