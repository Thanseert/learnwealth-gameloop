
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Lock, Star, Award, Check } from "lucide-react";

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
  isLast?: boolean;
  questionsCount?: number;
}

export function LessonCard({
  title,
  description,
  xp,
  difficulty,
  isCompleted = false,
  onClick,
  number,
  progress = 0,
  isLocked = false,
  isLast = false,
  questionsCount = 0,
}: LessonCardProps) {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  const getDifficultyStars = () => {
    switch (difficulty) {
      case "easy":
        return 1;
      case "medium":
        return 2;
      case "hard":
        return 3;
      default:
        return 1;
    }
  };

  return (
    <div className="flex items-start gap-8 relative animate-fade-in">
      <div className="flex flex-col items-center">
        {/* Level number with custom styling */}
        <div
          className={cn(
            "w-[60px] h-[60px] rounded-[16px] flex items-center justify-center text-2xl font-bold relative text-white shadow-lg transform transition-all duration-300",
            isCompleted ? "bg-green-500" : isLocked ? "bg-gray-400" : "bg-purple-600"
          )}
        >
          {isCompleted ? <Check className="w-8 h-8" /> : number}
          
          {/* XP Badge */}
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-yellow-900 border-2 border-yellow-500 shadow-md">
            +{xp} XP
          </div>
        </div>
        
        {/* Vertical line connector */}
        {!isLast && (
          <div 
            className={cn(
              "w-[3px] h-[160px] absolute top-[60px] left-1/2 -translate-x-1/2 -z-10",
              isCompleted ? "bg-green-500" : "bg-[#e2e8f0]"
            )}
          />
        )}
      </div>
      
      <Card
        className={cn(
          "flex-1 transition-all duration-300",
          isLocked 
            ? "opacity-75 bg-gray-100" 
            : "hover:-translate-y-2 hover:shadow-lg cursor-pointer bg-white",
          isCompleted && "border-green-500 border-2",
          "animate-scale-in border-[#e2e8f0] hover:border-purple-300"
        )}
        onClick={!isLocked ? onClick : undefined}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center">
                <h3 className="font-bold text-xl text-[#1e293b]">{title}</h3>
                {isCompleted && (
                  <Award className="ml-2 text-green-500 w-5 h-5" />
                )}
              </div>
              <p className="text-base text-[#64748b] leading-relaxed">{description}</p>
              
              {/* Difficulty indicator with stars */}
              <div className="flex items-center mt-1">
                <span className={cn("text-sm font-medium mr-2", getDifficultyColor())}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                <div className="flex space-x-1">
                  {[...Array(getDifficultyStars())].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4 fill-current", getDifficultyColor())} />
                  ))}
                  {[...Array(3 - getDifficultyStars())].map((_, i) => (
                    <Star key={i + getDifficultyStars()} className="w-4 h-4 text-gray-300" />
                  ))}
                </div>
              </div>
            </div>
            {isLocked && (
              <Lock className="w-6 h-6 text-gray-400 shrink-0 ml-4" />
            )}
          </div>
          
          {!isLocked && (
            <div className="space-y-4">
              <Progress 
                value={progress} 
                className="h-2 bg-[#f1f5f9]" 
              />
              <div className="flex items-center justify-start gap-6 text-sm text-[#64748b]">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                  {questionsCount} Questions
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
