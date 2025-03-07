
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  total: number;
  className?: string;
}

export function ProgressBar({ progress, total, className }: ProgressBarProps) {
  const percentage = Math.min((progress / total) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-1 text-sm">
        <span className="font-medium">Progress</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-primary to-purple-400 transition-all duration-1000 ease-out rounded-full relative"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}
