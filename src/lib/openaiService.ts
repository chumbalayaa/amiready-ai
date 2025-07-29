import { OpenAPISpec } from '@/types';

export async function generateOpenAISuggestions(spec: OpenAPISpec, apiKey: string): Promise<string[]> {
  try {
    const prompt = `You are an expert API reviewer. Given the following OpenAPI 3.0 spec (as JSON), provide 3 actionable suggestions to improve its AI readiness.\n\nSpec:\n${JSON.stringify(spec).slice(0, 8000)}\n\nSuggestions:`;

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
        return json.choices[0].message.content
          .split(/\n|\d+\./)
          .map((s: string) => s.trim())
          .filter(Boolean);
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