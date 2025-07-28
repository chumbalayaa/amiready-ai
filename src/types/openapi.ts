export interface OpenAPISpec {
  openapi: string;
  paths: Record<string, Record<string, OpenAPIOperation>>;
  components?: {
    schemas?: Record<string, unknown>;
    responses?: Record<string, unknown>;
  };
  info?: {
    title?: string;
    description?: string;
  };
}

export interface OpenAPIOperation {
  summary?: string;
  description?: string;
  parameters?: OpenAPIParameter[];
  responses?: Record<string, OpenAPIResponse>;
}

export interface OpenAPIParameter {
  name: string;
  description?: string;
  in: string;
  required?: boolean;
}

export interface OpenAPIResponse {
  description?: string;
  content?: Record<string, unknown>;
  examples?: Record<string, unknown>;
}

export interface SpectralResult {
  message: string;
  path: string[];
  severity: number;
} 