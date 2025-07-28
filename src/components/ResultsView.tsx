import { Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnalysisResult } from "@/types";

interface ResultsViewProps {
  results: AnalysisResult;
  onReset: () => void;
}

export function ResultsView({ results, onReset }: ResultsViewProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Analysis Results
          </h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              New Analysis
            </button>
          </div>
        </div>

        {/* Spectral Results Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Spectral Linting Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {results.spectralResults?.errors?.length || 0}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">Errors</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {results.spectralResults?.warnings?.length || 0}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Warnings</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {results.spectralResults?.info?.length || 0}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Info</div>
            </div>
          </div>
        </div>

        {/* AI Readiness Scores */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            AI Readiness Scores
          </h3>
          <div className="space-y-4">
            {results.aiReadinessScores?.map((endpoint, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {endpoint.path} ({endpoint.method})
                  </h4>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-sm font-medium",
                    endpoint.score >= 80 ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" :
                    endpoint.score >= 60 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" :
                    "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  )}>
                    {endpoint.score}/100
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {endpoint.summary}
                </p>
                {endpoint.suggestions && endpoint.suggestions.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Suggestions:
                    </h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {endpoint.suggestions.slice(0, 3).map((suggestion: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 