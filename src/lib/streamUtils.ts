import { AnalysisResult } from '@/types';

export function createStreamEncoder() {
  const encoder = new TextEncoder();

  return {
    sendProgress: (progress: number, step: string, stepKey?: string) => {
      const data = JSON.stringify({ type: "progress", progress, step, stepKey });
      return encoder.encode(`data: ${data}\n\n`);
    },

    sendComplete: (results: AnalysisResult) => {
      const data = JSON.stringify({ type: "complete", results });
      return encoder.encode(`data: ${data}\n\n`);
    }
  };
} 