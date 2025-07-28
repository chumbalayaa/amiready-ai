import { AnalysisResult } from '@/types';

// In-memory storage for results (in production, use a database)
const resultsStore = new Map<string, AnalysisResult>();

export function storeResult(result: AnalysisResult): void {
  resultsStore.set(result.id, result);
}

export function getResult(id: string): AnalysisResult | undefined {
  return resultsStore.get(id);
}

export function deleteResult(id: string): boolean {
  return resultsStore.delete(id);
}

export function getAllResults(): AnalysisResult[] {
  return Array.from(resultsStore.values());
} 