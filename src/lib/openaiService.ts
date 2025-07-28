import { OpenAPISpec } from '@/types';

export async function generateOpenAISuggestions(spec: OpenAPISpec, apiKey: string): Promise<string[]> {
  try {
    const prompt = `You are an expert API reviewer. Given the following OpenAPI 3.0 spec (as JSON), provide 3 actionable suggestions to improve its AI readiness.\n\nSpec:\n${JSON.stringify(spec).slice(0, 8000)}\n\nSuggestions:`;

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
    });

    const json = await response.json();

    if (json.choices && json.choices[0] && json.choices[0].message) {
      return json.choices[0].message.content
        .split(/\n|\d+\./)
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    return [];
  } catch (error) {
    return [`OpenAI suggestion step failed: ${error instanceof Error ? error.message : "Unknown error"}`];
  }
} 