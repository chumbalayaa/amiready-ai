import { runSpectralAnalysis } from '../spectralService'

// Mock the Spectral module
jest.mock('@stoplight/spectral', () => ({
  Spectral: jest.fn().mockImplementation(() => ({
    loadRuleset: jest.fn().mockResolvedValue(undefined),
    run: jest.fn().mockResolvedValue([
      {
        message: 'Test warning message',
        path: ['paths', '/test', 'get'],
        severity: 1
      },
      {
        message: 'Test error message',
        path: ['paths', '/test', 'post'],
        severity: 0
      }
    ])
  })),
  Document: jest.fn().mockImplementation((content, format) => ({
    content,
    format
  }))
}))

describe('runSpectralAnalysis', () => {
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

  it('should run Spectral analysis successfully', async () => {
    const results = await runSpectralAnalysis(mockSpec)

    expect(results).toHaveLength(2)
    expect(results[0]).toEqual({
      message: 'Test warning message',
      path: ['paths', '/test', 'get'],
      severity: 1
    })
    expect(results[1]).toEqual({
      message: 'Test error message',
      path: ['paths', '/test', 'post'],
      severity: 0
    })
  })

  it('should handle Spectral errors gracefully', async () => {
    const { Spectral } = require('@stoplight/spectral')
    Spectral.mockImplementation(() => ({
      loadRuleset: jest.fn().mockRejectedValue(new Error('Spectral failed')),
      run: jest.fn()
    }))

    const results = await runSpectralAnalysis(mockSpec)

    expect(results).toEqual([])
  })

  it('should handle empty results', async () => {
    const { Spectral } = require('@stoplight/spectral')
    Spectral.mockImplementation(() => ({
      loadRuleset: jest.fn().mockResolvedValue(undefined),
      run: jest.fn().mockResolvedValue([])
    }))

    const results = await runSpectralAnalysis(mockSpec)

    expect(results).toEqual([])
  })
}) 