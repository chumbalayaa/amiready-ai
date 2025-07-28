export interface SpectralResult {
  errors: Array<{
    message: string;
    path: string[];
    severity: string;
  }>;
  warnings: Array<{
    message: string;
    path: string[];
    severity: string;
  }>;
  info: Array<{
    message: string;
    path: string[];
    severity: string;
  }>;
}

export interface EndpointScore {
  path: string;
  method: string;
  score: number;
  summary: string;
  suggestions: string[];
}

export interface AnalysisResult {
  id: string;
  spectralResults: SpectralResult;
  aiReadinessScores: EndpointScore[];
  suggestions: string[];
  timestamp: string;
}

export type InputType = "url" | "file"; 