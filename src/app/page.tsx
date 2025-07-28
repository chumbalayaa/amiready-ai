"use client";

import { useState } from "react";
import { Upload, Link, Key, Play, FileText, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpectralResult {
  errors: Array<{
    message: string;
    path: string[];
    severity: string;
  }>;
  warnings: Array<{
    message: string;
    path: string[];
    severity: string;
  }>;
  info: Array<{
    message: string;
    path: string[];
    severity: string;
  }>;
}

interface EndpointScore {
  path: string;
  method: string;
  score: number;
  summary: string;
  suggestions: string[];
}

interface AnalysisResult {
  id: string;
  spectralResults: SpectralResult;
  aiReadinessScores: EndpointScore[];
  suggestions: string[];
  timestamp: string;
}

export default function Home() {
  const [inputType, setInputType] = useState<"url" | "file">("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!url && !file) return;

    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep("Preparing analysis...");

    const formData = new FormData();
    if (inputType === "url") {
      formData.append("url", url);
    } else if (file) {
      formData.append("file", file);
    }
    if (apiKey) {
      formData.append("apiKey", apiKey);
    }

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
            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Upload Your OpenAPI Specification
              </h2>

              {/* Input Type Toggle */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setInputType("url")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                    inputType === "url"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <Link className="w-4 h-4" />
                  URL
                </button>
                <button
                  onClick={() => setInputType("file")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                    inputType === "file"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <Upload className="w-4 h-4" />
                  File Upload
                </button>
              </div>

              {/* URL Input */}
              {inputType === "url" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    OpenAPI Specification URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/openapi.json"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              {/* File Upload */}
              {inputType === "file" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload OpenAPI File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".json,.yaml,.yml"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        JSON, YAML files up to 10MB
                      </p>
                    </label>
                  </div>
                  {file && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              )}

              {/* API Key Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  OpenAI API Key (Optional)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Your key is stored server-side and used only if needed for enhanced analysis.
                </p>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!url && !file)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                  isAnalyzing || (!url && !file)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Analyze Specification
                  </>
                )}
              </button>
            </div>

            {/* Progress Section */}
            {isAnalyzing && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Analysis Progress
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{currentStep}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ResultsView results={results} onReset={() => setResults(null)} />
        )}
      </div>
    </div>
  );
}

function ResultsView({ results, onReset }: { results: AnalysisResult; onReset: () => void }) {
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
