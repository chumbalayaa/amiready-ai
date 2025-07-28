import yaml from "js-yaml";
import { OpenAPISpec } from '@/types';

export async function fetchSpecFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch spec from URL: ${response.statusText}`);
  }
  return await response.text();
}

export async function readSpecFromFile(file: File): Promise<string> {
  return await file.text();
}

export function parseSpecContent(specContent: string): OpenAPISpec {
  try {
    if (specContent.trim().startsWith("{")) {
      return JSON.parse(specContent);
    } else {
      return yaml.load(specContent) as OpenAPISpec;
    }
  } catch {
    throw new Error("Invalid OpenAPI specification format");
  }
}

export function validateOpenAPIVersion(spec: OpenAPISpec): void {
  if (!spec.openapi || !spec.openapi.startsWith("3.")) {
    throw new Error("Only OpenAPI 3.x specifications are supported");
  }
}

export async function getSpecContent(url?: string, file?: File): Promise<string> {
  if (url) {
    return await fetchSpecFromUrl(url);
  } else if (file) {
    return await readSpecFromFile(file);
  } else {
    throw new Error("No spec provided");
  }
} 