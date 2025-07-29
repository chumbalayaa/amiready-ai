"use client";

import { InputSection } from "@/components/InputSection";
import { ProgressSection } from "@/components/ProgressSection";
import { ResultsView } from "@/components/ResultsView";
import { useAnalysis } from "@/hooks/useAnalysis";

export default function Home() {
  const { isAnalyzing, progress, currentStep, results, analyze, reset, steps } = useAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Ready API Checker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analyze your OpenAPI specifications for AI-readiness and token-friendliness. 
            Get actionable insights to optimize your APIs for LLM-powered agents.
          </p>
        </header>

        {!results ? (
          <div className="max-w-4xl mx-auto">
            <InputSection onAnalyze={analyze} isAnalyzing={isAnalyzing} />
            
            {isAnalyzing && (
              <ProgressSection steps={steps} progress={progress} currentStep={currentStep} />
            )}
          </div>
        ) : (
          <ResultsView results={results} onReset={reset} />
        )}
      </div>
    </div>
  );
}
