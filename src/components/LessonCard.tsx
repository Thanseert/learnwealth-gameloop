
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
        {/* Larger circle with stronger gradient and shadow */}
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg relative",
            isCompleted 
              ? "bg-gradient-to-br from-primary/30 to-primary text-white border-[6px] border-primary" 
              : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 border-[6px] border-gray-300"
          )}
        >
          {number}
        </div>
        {/* Thicker line with stronger gradient */}
        <div 
          className={cn(
            "w-2 h-56 absolute top-20 left-1/2 -translate-x-1/2 -z-10 rounded-full",
            isCompleted 
              ? "bg-gradient-to-b from-primary via-primary/50 to-primary/20" 
              : "bg-gradient-to-b from-gray-300 via-gray-200 to-gray-100"
          )}
        />
      </div>
      
      <Card
        className={cn(
          "flex-1 transition-all duration-300 border-2",
          isLocked 
            ? "opacity-75 border-gray-200" 
            : "hover:-translate-y-1 hover:shadow-xl cursor-pointer border-gray-200 hover:border-primary",
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
                  <div className="w-3 h-3 rounded-full bg-primary/30" />
                  <span>{Math.round(progress * 0.1)}/10 Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/30" />
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
