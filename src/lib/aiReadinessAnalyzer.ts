import { OpenAPISpec, OpenAPIParameter, OpenAPIResponse, EndpointScore } from '@/types';

export function analyzeAIReadiness(spec: OpenAPISpec): EndpointScore[] {
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