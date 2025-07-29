import { OpenAPISpec } from '@/types';

export async function generateOpenAISuggestions(spec: OpenAPISpec, apiKey: string): Promise<string[]> {
  try {
    const prompt = `You are an expert API reviewer. Given the following OpenAPI 3.0 spec (as JSON), provide exactly 3 actionable suggestions to improve its AI readiness. Format your response as a numbered list (1., 2., 3.) with clear, concise suggestions.\n\nSpec:\n${JSON.stringify(spec).slice(0, 8000)}\n\nSuggestions:`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert API reviewer." },
            { role: "user", content: prompt }
          ],
          max_tokens: 256,
          temperature: 0.4,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await response.json();

      if (json.choices && json.choices[0] && json.choices[0].message) {
        const content = json.choices[0].message.content;

        // Extract suggestions from the response
        // Look for patterns like "1. Suggestion" or "**Title**" followed by content
        const suggestions: string[] = [];

        // Split by numbered items (1., 2., 3., etc.)
        const numberedParts = content.split(/\d+\.\s*/);

        for (let i = 1; i < numberedParts.length && suggestions.length < 3; i++) {
          const part = numberedParts[i].trim();
          if (part.length > 20) { // Only include substantial suggestions
            // Clean up the suggestion text
            const cleanSuggestion = part
              .replace(/\*\*/g, '') // Remove markdown bold
              .replace(/\n+/g, ' ') // Replace newlines with spaces
              .replace(/\s+/g, ' ') // Normalize whitespace
              .trim();

            if (cleanSuggestion.length > 20) {
              suggestions.push(cleanSuggestion);
            }
          }
        }

        return suggestions;
      }

      return [];
    } catch (error) {
      clearTimeout(timeoutId);
      return [`OpenAI suggestion step failed: ${error instanceof Error ? error.message : "Unknown error"}`];
    }
  } catch (error) {
    return [`OpenAI suggestion step failed: ${error instanceof Error ? error.message : "Unknown error"}`];
  }
}