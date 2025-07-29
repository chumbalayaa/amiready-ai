"use client";

import { useState } from "react";
import { Upload, Link, Key, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputType } from "@/types";

interface InputSectionProps {
  onAnalyze: (formData: FormData) => Promise<void>;
  isAnalyzing: boolean;
}

export function InputSection({ onAnalyze, isAnalyzing }: InputSectionProps) {
  const [inputType, setInputType] = useState<InputType>("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!url && !file) return;

    const formData = new FormData();
    if (inputType === "url") {
      formData.append("url", url);
    } else if (file) {
      formData.append("file", file);
    }
    if (apiKey) {
      formData.append("apiKey", apiKey);
    }

    await onAnalyze(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-purple-100 dark:border-purple-800">
      <h2 className="text-2xl font-semibold mb-6 text-[#302547] dark:text-white">
        Upload Your OpenAPI Specification
      </h2>

      {/* Input Type Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setInputType("url")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
            inputType === "url"
              ? "bg-[#302547] text-white border-[#302547]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
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
              ? "bg-[#302547] text-white border-[#302547]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          )}
        >
          <Upload className="w-4 h-4" />
          File Upload
        </button>
      </div>

      {/* URL Input */}
      {inputType === "url" && (
        <div className="mb-6">
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            OpenAPI Specification URL
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/openapi.json"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#302547] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      )}

      {/* File Upload */}
      {inputType === "file" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload OpenAPI File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#302547] transition-colors">
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
        <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          OpenAI API Key (Optional)
        </label>
        <div className="relative">
          <input
            id="api-key-input"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#302547] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Your key is stored server-side and used only if needed for enhanced analysis.
        </p>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleSubmit}
        disabled={isAnalyzing || (!url && !file)}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
          isAnalyzing || (!url && !file)
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#302547] text-white hover:bg-[#1a1a2e]"
        )}
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Analyzing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 cursor-default" />
            Analyze Specification
          </>
        )}
      </button>
    </div>
  );
} 