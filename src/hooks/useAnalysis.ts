import { useState } from "react";
import { AnalysisResult } from "@/types/analysis";

export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const analyze = async (formData: FormData) => {
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep("Preparing analysis...");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.type === "progress") {
              setProgress(data.progress);
              setCurrentStep(data.step);
            } else if (data.type === "complete") {
              setResults(data.results);
              setIsAnalyzing(false);
              setProgress(100);
            }
          }
        }
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResults(null);
    setProgress(0);
    setCurrentStep("");
    setIsAnalyzing(false);
  };

  return {
    isAnalyzing,
    progress,
    currentStep,
    results,
    analyze,
    reset,
  };
} 