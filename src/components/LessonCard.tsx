
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface LessonCardProps {
  title: string;
  description: string;
  xp: number;
  difficulty: "easy" | "medium" | "hard";
  isCompleted?: boolean;
  onClick?: () => void;
  number: number;
  progress?: number;
  isLocked?: boolean;
}

export function LessonCard({
  title,
  description,
  isCompleted = false,
  onClick,
  number,
  progress = 0,
  isLocked = false,
}: LessonCardProps) {
  return (
    <div className="flex items-start gap-4 relative">
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-semibold",
            isCompleted ? "bg-primary text-white" : "bg-primary/10 text-primary"
          )}
        >
          {number}
        </div>
        {/* Vertical line */}
        <div className="w-0.5 h-full bg-gray-200 absolute top-16 left-6 -z-10" />
      </div>
      
      <Card
        className={cn(
          "flex-1 transition-all duration-300 hover:shadow-lg cursor-pointer",
          isLocked ? "opacity-75" : "hover:-translate-y-1",
          "animate-scale-in"
        )}
        onClick={!isLocked ? onClick : undefined}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            {isLocked && (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>
          
          {!isLocked && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{Math.round(progress * 0.1)}/10 Questions</span>
                <span>{Math.round(progress * 0.15)}/15 Practice</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
