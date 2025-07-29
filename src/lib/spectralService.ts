import { Spectral, Document, SpectralResult as SpectralSpectralResult } from '@stoplight/spectral';
import { SpectralResult, OpenAPISpec } from '@/types';

export async function runSpectralAnalysis(spec: OpenAPISpec): Promise<SpectralResult[]> {
  try {
    // Create a new Spectral instance
    const spectral = new Spectral();

    // Load the OpenAPI ruleset
    await spectral.loadRuleset('spectral:oas');

    // Create a document from the spec
    const document = new Document(JSON.stringify(spec), 'json');

    // Run the analysis
    const results = await spectral.run(document);

    // Convert Spectral results to our format
    return results.map((result: SpectralSpectralResult) => ({
      message: result.message,
      path: result.path,
      severity: result.severity
    }));
  } catch (error) {
    console.error('Spectral analysis failed:', error);
    // Return empty results if Spectral fails
    return [];
  }
} 