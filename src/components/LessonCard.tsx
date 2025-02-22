
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
        {/* Square with custom rounded corners for numbers */}
        <div
          className={cn(
            "w-[60px] h-[60px] rounded-[16px] flex items-center justify-center text-2xl font-semibold relative",
            isCompleted 
              ? "bg-[#8b5cf6] text-white" 
              : "bg-[#f1f5f9] text-[#8b5cf6]"
          )}
        >
          {number}
        </div>
        {/* Custom thin vertical line */}
        <div 
          className={cn(
            "w-[2px] h-[160px] absolute top-[60px] left-1/2 -translate-x-1/2 -z-10",
            isCompleted 
              ? "bg-[#8b5cf6]/20" 
              : "bg-[#e2e8f0]"
          )}
        />
      </div>
      
      <Card
        className={cn(
          "flex-1 transition-all duration-300",
          isLocked 
            ? "opacity-75" 
            : "hover:-translate-y-1 hover:shadow-lg cursor-pointer",
          "animate-scale-in bg-white border-[#e2e8f0]"
        )}
        onClick={!isLocked ? onClick : undefined}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-[#1e293b]">{title}</h3>
              <p className="text-base text-[#64748b] leading-relaxed">{description}</p>
            </div>
            {isLocked && (
              <Lock className="w-5 h-5 text-[#94a3b8] shrink-0 ml-4" />
            )}
          </div>
          
          {!isLocked && (
            <div className="space-y-4">
              <Progress 
                value={progress} 
                className="h-2 bg-[#f1f5f9]" 
              />
              <div className="flex items-center justify-start gap-6 text-sm text-[#64748b]">
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
