import { CheckCircle, Loader2, Circle } from "lucide-react";

interface Step {
  key: string;
  label: string;
  status: "pending" | "in_progress" | "complete";
}

interface ProgressSectionProps {
  steps: Step[];
  progress: number;
  currentStep?: string;
}

export function ProgressSection({ steps, progress, currentStep }: ProgressSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Analysis Progress
      </h3>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>
            {currentStep || 
              steps.find((s) => s.status === "in_progress")?.label ||
              steps.find((s) => s.status === "complete")?.label ||
              steps[0].label}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <ol className="space-y-2 mt-4">
        {steps.map((step) => (
          <li key={step.key} className="flex items-center gap-2 text-sm">
            {step.status === "complete" ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : step.status === "in_progress" ? (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400" />
            )}
            <span
              className={
                step.status === "in_progress"
                  ? "font-semibold text-blue-600 dark:text-blue-400"
                  : step.status === "complete"
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-gray-400"
              }
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
} 