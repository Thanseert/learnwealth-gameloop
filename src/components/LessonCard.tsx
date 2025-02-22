
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
    <div className="flex items-start gap-8 relative animate-fade-in">
      <div className="flex flex-col items-center">
        {/* Square with rounded corners for numbers */}
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold shadow-md relative",
            isCompleted 
              ? "bg-primary text-white" 
              : "bg-primary/10 text-primary"
          )}
        >
          {number}
        </div>
        {/* Thin vertical line */}
        <div 
          className={cn(
            "w-[2px] h-40 absolute top-16 left-1/2 -translate-x-1/2 -z-10",
            isCompleted 
              ? "bg-primary/20" 
              : "bg-gray-200"
          )}
        />
      </div>
      
      <Card
        className={cn(
          "flex-1 transition-all duration-300",
          isLocked 
            ? "opacity-75" 
            : "hover:-translate-y-1 hover:shadow-lg cursor-pointer",
          "animate-scale-in bg-white"
        )}
        onClick={!isLocked ? onClick : undefined}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-gray-900">{title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{description}</p>
            </div>
            {isLocked && (
              <Lock className="w-5 h-5 text-gray-400 shrink-0 ml-4" />
            )}
          </div>
          
          {!isLocked && (
            <div className="space-y-4">
              <Progress 
                value={progress} 
                className="h-2 bg-gray-100" 
              />
              <div className="flex items-center justify-start gap-6 text-sm text-gray-600">
                <span>{Math.round(progress * 0.15)}/15 Lessons</span>
                <span>{Math.round(progress * 0.1)}/10 Practice</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
