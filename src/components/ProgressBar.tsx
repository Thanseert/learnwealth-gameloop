
import { cn } from "@/lib/utils";
import { Trophy, Award, Star } from "lucide-react";

interface ProgressBarProps {
  progress: number;
  total: number;
  className?: string;
}

export function ProgressBar({ progress, total, className }: ProgressBarProps) {
  const percentage = Math.min((progress / total) * 100, 100);
  const isComplete = percentage === 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-1 text-sm">
        <span className="font-medium flex items-center gap-1">
          Quest Progress
          {isComplete && <Trophy className="w-4 h-4 text-yellow-500 animate-bounce" />}
        </span>
        <span className="font-bold">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300 relative">
        {/* Animated progress bar with gradient */}
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-primary to-purple-400 transition-all duration-1000 ease-out rounded-full relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect animation */}
          <div className="absolute inset-0 bg-white opacity-20 animate-[slide-in-right_2s_linear_infinite]"></div>
          
          {/* Milestone markers along the progress bar */}
          {[25, 50, 75].map((milestone) => (
            <div 
              key={milestone} 
              className={cn(
                "absolute top-0 bottom-0 w-0.5 bg-white",
                percentage < milestone ? "opacity-30" : "opacity-70"
              )}
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>
        
        {/* Add milestone markers */}
        {[25, 50, 75, 100].map((milestone) => (
          <div 
            key={milestone}
            className={cn(
              "absolute -top-1 transform -translate-x-1/2 transition-all duration-300",
              percentage >= milestone 
                ? "text-purple-700 font-bold" 
                : "text-gray-400"
            )}
            style={{ left: `${milestone}%` }}
          >
            {milestone === 100 && isComplete ? (
              <Trophy className="w-4 h-4 text-yellow-500" />
            ) : milestone === 75 ? (
              <Star className="w-4 h-4" className={percentage >= milestone ? "text-purple-500" : "text-gray-300"} />
            ) : milestone === 50 ? (
              <Award className="w-4 h-4" className={percentage >= milestone ? "text-purple-500" : "text-gray-300"} />
            ) : (
              <div className={cn(
                "w-2 h-2 rounded-full border",
                percentage >= milestone 
                  ? "bg-purple-500 border-purple-300" 
                  : "bg-gray-300 border-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
