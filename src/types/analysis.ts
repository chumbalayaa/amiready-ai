import { SpectralResult } from './openapi';

export interface EndpointScore {
  path: string;
  method: string;
  score: number;
  summary: string;
  suggestions: string[];
}

export interface AnalysisResult {
  id: string;
  spectralResults: {
    errors: SpectralResult[];
    warnings: SpectralResult[];
    info: SpectralResult[];
  };
  aiReadinessScores: EndpointScore[];
  suggestions: string[];
  timestamp: string;
}

export type InputType = "url" | "file"; 