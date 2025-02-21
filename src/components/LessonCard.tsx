
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
    <div className="flex items-start gap-6 relative animate-fade-in">
      <div className="flex flex-col items-center">
        {/* Circle with border and gradient */}
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold relative",
            isCompleted 
              ? "bg-gradient-to-br from-primary/20 to-primary/10 text-primary border-4 border-primary" 
              : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400 border-4 border-gray-200"
          )}
        >
          {number}
        </div>
        {/* Thicker vertical connecting line with gradient */}
        <div 
          className={cn(
            "w-1.5 h-48 absolute top-16 left-1/2 -translate-x-1/2 -z-10",
            isCompleted 
              ? "bg-gradient-to-b from-primary/30 to-primary/10" 
              : "bg-gradient-to-b from-gray-200 to-gray-100"
          )}
        />
      </div>
      
      <Card
        className={cn(
          "flex-1 transition-all duration-300 border-2",
          isLocked 
            ? "opacity-75 border-gray-100" 
            : "hover:-translate-y-1 hover:shadow-lg cursor-pointer border-gray-100 hover:border-primary/20",
          "animate-scale-in"
        )}
        onClick={!isLocked ? onClick : undefined}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
            {isLocked && (
              <Lock className="w-5 h-5 text-gray-400 shrink-0 ml-4" />
            )}
          </div>
          
          {!isLocked && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="text-primary font-semibold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                  <span>{Math.round(progress * 0.1)}/10 Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                  <span>{Math.round(progress * 0.15)}/15 Practice</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
