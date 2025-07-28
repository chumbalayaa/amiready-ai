interface ProgressSectionProps {
  currentStep: string;
  progress: number;
}

export function ProgressSection({ currentStep, progress }: ProgressSectionProps) {
  return (
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
  );
} 