import { useState } from "react";
import { AnalysisResult } from "@/types";

export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [steps, setSteps] = useState<Array<{ key: string; label: string; status: "pending" | "in_progress" | "complete" }>>([
    { key: "fetch", label: "Fetching OpenAPI specification...", status: "pending" },
    { key: "parse", label: "Parsing specification...", status: "pending" },
    { key: "validate", label: "Validating OpenAPI version...", status: "pending" },
    { key: "spectral", label: "Analyzing spec with Spectral linting...", status: "pending" },
    { key: "ai_readiness", label: "Assessing AI readiness...", status: "pending" },
    { key: "openai", label: "Generating suggestions with OpenAI...", status: "pending" },
    { key: "finalize", label: "Finalizing and saving results...", status: "pending" },
  ]);

  const analyze = async (formData: FormData) => {
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep("Preparing analysis...");
    setResults(null);
    // Reset steps
    setSteps([
      { key: "fetch", label: "Fetching OpenAPI specification...", status: "pending" },
      { key: "parse", label: "Parsing specification...", status: "pending" },
      { key: "validate", label: "Validating OpenAPI version...", status: "pending" },
      { key: "spectral", label: "Analyzing spec with Spectral linting...", status: "pending" },
      { key: "ai_readiness", label: "Assessing AI readiness...", status: "pending" },
      { key: "openai", label: "Generating suggestions with OpenAI...", status: "pending" },
      { key: "finalize", label: "Finalizing and saving results...", status: "pending" },
    ]);

    // Set a timeout to ensure analysis stops even if complete event is missed
    const timeoutId = setTimeout(() => {
      console.warn("Analysis timeout - forcing stop");
      setIsAnalyzing(false);
      setCurrentStep("Analysis timed out");
    }, 30000); // 30 second timeout

    try {
      console.log("Fetching analysis", formData);
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      // For debugging: try non-streaming response first
      const results = await response.json();
      console.log("✅ Analysis complete, results:", results);
      clearTimeout(timeoutId);
      setResults(results);
      setIsAnalyzing(false);
      setProgress(100);
      setCurrentStep("Analysis complete");
      setSteps(prev => prev.map(step => ({ ...step, status: "complete" })));
      return;

      // Streaming code commented out for debugging
      /*
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue; // skip empty data lines
            let data;
            try {
              data = JSON.parse(jsonStr);
              console.log("Received data:", data); // Debug log
            } catch (e) {
              console.warn("Failed to parse JSON:", jsonStr, e);
              continue;
            }
            if (data.type === "progress") {
              console.log("🪨 Progress step:", data.stepKey, data.step);
              setProgress(data.progress);
              setCurrentStep(data.step);
              if (data.stepKey) {
                setSteps(prev => prev.map(step => {
                  // If this is the current step, mark it as in_progress
                  if (step.key === data.stepKey) {
                    return { ...step, status: "in_progress" };
                  }
                  // If this step was in_progress, mark it as complete
                  if (step.status === "in_progress") {
                    return { ...step, status: "complete" };
                  }
                  return step;
                }));
              }
            } else if (data.type === "complete") {
              console.log("✅ Analysis complete, results:", data.results);
              clearTimeout(timeoutId); // Clear the timeout
              setResults(data.results);
              setIsAnalyzing(false);
              setProgress(100);
              setCurrentStep("Analysis complete");
              // Mark all steps as complete
              setSteps(prev => prev.map(step => ({ ...step, status: "complete" })));
            } else {
              console.log("⚠️ Unknown event type:", data.type);
            }
          }
        }
      }
      */
    } catch (error) {
      console.error("Analysis error:", error);
      clearTimeout(timeoutId); // Clear the timeout on error
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResults(null);
    setProgress(0);
    setCurrentStep("");
    setIsAnalyzing(false);
    setSteps([
      { key: "fetch", label: "Fetching OpenAPI specification...", status: "pending" },
      { key: "parse", label: "Parsing specification...", status: "pending" },
      { key: "validate", label: "Validating OpenAPI version...", status: "pending" },
      { key: "spectral", label: "Analyzing spec with Spectral linting...", status: "pending" },
      { key: "ai_readiness", label: "Assessing AI readiness...", status: "pending" },
      { key: "openai", label: "Generating suggestions with OpenAI...", status: "pending" },
      { key: "finalize", label: "Finalizing and saving results...", status: "pending" },
    ]);
  };

  return {
    isAnalyzing,
    progress,
    currentStep,
    results,
    steps,
    analyze,
    reset,
  };
} 