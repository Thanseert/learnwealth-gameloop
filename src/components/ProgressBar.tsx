
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
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
