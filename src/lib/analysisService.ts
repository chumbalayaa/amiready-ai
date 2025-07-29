import { v4 as uuidv4 } from "uuid";
import { OpenAPISpec, SpectralResult, AnalysisResult } from '@/types';
import { getSpecContent, parseSpecContent, validateOpenAPIVersion } from './openapiParser';
import { analyzeAIReadiness } from './aiReadinessAnalyzer';
import { generateOpenAISuggestions } from './openaiService';
import { storeResult } from './resultsStore';

export interface AnalysisOptions {
  url?: string;
  file?: File;
  apiKey?: string;
  onProgress?: (progress: number, step: string, stepKey?: string) => void;
}

export async function performAnalysis(options: AnalysisOptions): Promise<AnalysisResult> {
  const { url, file, apiKey, onProgress } = options;

  // Step 1: Get spec content
  onProgress?.(15, "Fetching OpenAPI specification...", "fetch");
  const specContent = await getSpecContent(url, file);

  // Step 2: Parse spec
  onProgress?.(30, "Parsing specification...", "parse");
  const spec: OpenAPISpec = parseSpecContent(specContent);

  // Step 3: Validate OpenAPI version
  onProgress?.(45, "Validating OpenAPI version...", "validate");
  validateOpenAPIVersion(spec);

  // Step 4: Spectral linting (simulated for now)
  onProgress?.(60, "Analyzing spec with Spectral linting...", "spectral");
  const spectralResults: SpectralResult[] = [];

  // Step 5: AI readiness analysis
  onProgress?.(75, "Assessing AI readiness...", "ai_readiness");
  const aiReadinessScores = analyzeAIReadiness(spec);

  // Step 6: OpenAI suggestions (optional)
  let openAISuggestions: string[] = [];
  if (apiKey) {
    onProgress?.(85, "Generating suggestions with OpenAI...", "openai");
    openAISuggestions = await generateOpenAISuggestions(spec, apiKey);
  } else {
    // Skip OpenAI step if no API key
    onProgress?.(85, "Skipping OpenAI suggestions (no API key)...", "openai");
  }

  // Step 7: Create and store results
  onProgress?.(95, "Finalizing and saving results...", "finalize");
  const resultId = uuidv4();
  const results: AnalysisResult = {
    id: resultId,
    spectralResults: {
      errors: spectralResults.filter(r => r.severity === 0),
      warnings: spectralResults.filter(r => r.severity === 1),
      info: spectralResults.filter(r => r.severity === 2)
    },
    aiReadinessScores,
    suggestions: openAISuggestions,
    timestamp: new Date().toISOString()
  };

  storeResult(results);
  return results;
} 