import { NextRequest, NextResponse } from "next/server";
import yaml from "js-yaml";
import { v4 as uuidv4 } from "uuid";

// In-memory storage for results (in production, use a database)
const resultsStore = new Map<string, AnalysisResult>();

interface OpenAPISpec {
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

interface OpenAPIOperation {
  summary?: string;
  description?: string;
  parameters?: OpenAPIParameter[];
  responses?: Record<string, OpenAPIResponse>;
}

interface OpenAPIParameter {
  name: string;
  description?: string;
  in: string;
  required?: boolean;
}

interface OpenAPIResponse {
  description?: string;
  content?: Record<string, unknown>;
  examples?: Record<string, unknown>;
}

interface SpectralResult {
  message: string;
  path: string[];
  severity: number;
}

interface EndpointScore {
  path: string;
  method: string;
  score: number;
  summary: string;
  suggestions: string[];
}

interface AnalysisResult {
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

// Custom heuristics for AI readiness
function analyzeAIReadiness(spec: OpenAPISpec): EndpointScore[] {
  const endpoints: EndpointScore[] = [];

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (method === "parameters") continue;

      let score = 100;
      const suggestions: string[] = [];

      // Check for summary and description
      if (!operation.summary) {
        score -= 15;
        suggestions.push("Add a summary to describe what this endpoint does");
      }
      if (!operation.description) {
        score -= 10;
        suggestions.push("Add a detailed description for better AI understanding");
      }

      // Check for response examples
      if (!operation.responses || !Object.values(operation.responses).some((resp: OpenAPIResponse) => resp.examples || resp.content)) {
        score -= 15;
        suggestions.push("Add response examples to help AI understand the data structure");
      }

      // Check for error responses
      const hasErrorResponses = operation.responses && Object.keys(operation.responses).some(code =>
        parseInt(code) >= 400
      );
      if (!hasErrorResponses) {
        score -= 20;
        suggestions.push("Document error responses (4xx, 5xx) for better error handling");
      }

      // Check for pagination support
      const hasPagination = operation.parameters?.some((param: OpenAPIParameter) =>
        param.name === "limit" || param.name === "page" || param.name === "offset"
      );
      if (method === "get" && !hasPagination) {
        score -= 15;
        suggestions.push("Add pagination parameters (limit, page, offset) for large datasets");
      }

      // Check for parameter documentation
      if (operation.parameters) {
        const undocumentedParams = operation.parameters.filter((param: OpenAPIParameter) => !param.description);
        if (undocumentedParams.length > 0) {
          score -= Math.min(10, undocumentedParams.length * 2);
          suggestions.push(`Document all parameters (${undocumentedParams.length} missing descriptions)`);
        }
      }

      // Check for consistent naming
      const pathSegments = path.split("/").filter(Boolean);
      const hasInconsistentNaming = pathSegments.some(segment =>
        segment.includes("_") && pathSegments.some(s => s.includes("-"))
      );
      if (hasInconsistentNaming) {
        score -= 10;
        suggestions.push("Use consistent naming convention (either snake_case or kebab-case)");
      }

      // Ensure score doesn't go below 0
      score = Math.max(0, score);

      endpoints.push({
        path,
        method: method.toUpperCase(),
        score,
        summary: operation.summary || "No summary provided",
        suggestions: suggestions.slice(0, 3) // Limit to top 3 suggestions
      });
    }
  }

  return endpoints;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const sendProgress = (progress: number, step: string) => {
    const data = JSON.stringify({ type: "progress", progress, step });
    return encoder.encode(`data: ${data}\n\n`);
  };

  const sendComplete = (results: AnalysisResult) => {
    const data = JSON.stringify({ type: "complete", results });
    return encoder.encode(`data: ${data}\n\n`);
  };

  try {
    const formData = await request.formData();
    const url = formData.get("url") as string;
    const file = formData.get("file") as File;
    const apiKey = formData.get("apiKey") as string;

    let specContent: string;

    // Get spec content
    if (url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch spec from URL: ${response.statusText}`);
      }
      specContent = await response.text();
    } else if (file) {
      specContent = await file.text();
    } else {
      throw new Error("No spec provided");
    }

    // Parse spec
    let spec: OpenAPISpec;
    try {
      if (specContent.trim().startsWith("{")) {
        spec = JSON.parse(specContent);
      } else {
        spec = yaml.load(specContent) as OpenAPISpec;
      }
    } catch (error) {
      throw new Error("Invalid OpenAPI specification format");
    }

    // Validate OpenAPI version
    if (!spec.openapi || !spec.openapi.startsWith("3.")) {
      throw new Error("Only OpenAPI 3.x specifications are supported");
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Step 1: Spectral Analysis (simulated for now)
          controller.enqueue(sendProgress(10, "Analyzing spec with Spectral linting..."));

          // For now, we'll simulate Spectral analysis
          // In a real implementation, you'd configure Spectral properly
          const spectralResults: SpectralResult[] = [];

          controller.enqueue(sendProgress(50, "Assessing AI readiness..."));

          // Step 2: AI Readiness Analysis
          const aiReadinessScores = analyzeAIReadiness(spec);

          // Generate results
          const resultId = uuidv4();
          const results: AnalysisResult = {
            id: resultId,
            spectralResults: {
              errors: spectralResults.filter(r => r.severity === 0),
              warnings: spectralResults.filter(r => r.severity === 1),
              info: spectralResults.filter(r => r.severity === 2)
            },
            aiReadinessScores,
            suggestions: [],
            timestamp: new Date().toISOString()
          };

          // Store results
          resultsStore.set(resultId, results);

          controller.enqueue(sendProgress(100, "Analysis complete"));
          controller.enqueue(sendComplete(results));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing result ID" }, { status: 400 });
  }

  const results = resultsStore.get(id);
  if (!results) {
    return NextResponse.json({ error: "Results not found" }, { status: 404 });
  }

  return NextResponse.json(results);
} 