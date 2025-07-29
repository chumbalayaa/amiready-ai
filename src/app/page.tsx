"use client";

import Image from "next/image";
import { InputSection } from "@/components/InputSection";
import { ProgressSection } from "@/components/ProgressSection";
import { ResultsView } from "@/components/ResultsView";
import { useAnalysis } from "@/hooks/useAnalysis";

export default function Home() {
  const { isAnalyzing, progress, currentStep, results, analyze, reset, steps } = useAnalysis();

  return (
    <div className="min-h-screen bg-[#302547]">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 mr-4">
              <Image 
                src="/favicon.ico" 
                alt="AI-Ready API Checker Logo" 
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-0">
              API AI Readiness Checker
            </h1>
          </div>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Is your API ready for AI agents? Test MCP compatibility and get expert guidance to make your endpoints AI-friendly.
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
