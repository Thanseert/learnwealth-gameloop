
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Lock, Star, Award, Check, Sparkles, Gift } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
    <div className={cn(
      "flex items-start relative animate-fade-in group",
      isMobile ? "flex-col gap-4" : "gap-8"
    )}>
      <div className={cn(
        "flex flex-col items-center",
        isMobile && "flex-row gap-4 w-full"
      )}>
        {/* Level badge with glow effect for completed levels */}
        <div
          className={cn(
            "rounded-[16px] flex items-center justify-center text-2xl font-bold relative text-white shadow-lg transform transition-all duration-300 level-badge",
            isMobile ? "w-[50px] h-[50px] text-xl" : "w-[60px] h-[60px]",
            isCompleted ? "bg-green-500 group-hover:rotate-3" : isLocked ? "bg-gray-400" : "bg-purple-600 group-hover:-translate-y-1"
          )}
        >
          {isCompleted ? (
            <>
              <Check className={cn(isMobile ? "w-6 h-6" : "w-8 h-8")} />
              {/* Animated glow for completed levels */}
              <div className="absolute inset-0 rounded-[16px] bg-green-400 blur-md -z-10 opacity-50 animate-pulse"></div>
            </>
          ) : (
            number
          )}
          
          {/* XP Badge with sparkle animation */}
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-yellow-900 border-2 border-yellow-500 shadow-md transform group-hover:scale-110 transition-transform">
            <div className="flex items-center gap-0.5">
              <span>+{xp}</span>
              <Sparkles className="w-3 h-3 text-yellow-700 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Mobile only lesson title next to the badge */}
        {isMobile && (
          <div className="flex-1">
            <h3 className="font-bold text-lg text-[#1e293b]">{title}</h3>
            {isCompleted && (
              <Award className="inline-block ml-1 text-green-500 w-4 h-4" />
            )}
          </div>
        )}
        
        {/* Vertical line connector with pulse animation for active path - hidden on mobile */}
        {!isLast && !isMobile && (
          <div 
            className={cn(
              "w-[3px] h-[160px] absolute top-[60px] left-1/2 -translate-x-1/2 -z-10 transition-all duration-300",
              isCompleted ? "bg-green-500" : "bg-[#e2e8f0]",
              !isCompleted && !isLocked && "group-hover:bg-purple-300"
            )}
          />
        )}
      </div>
      
      {/* Card with hover animations and effects */}
      <Card
        className={cn(
          "transition-all duration-300 border-2 overflow-hidden",
          isMobile ? "w-full" : "flex-1",
          isLocked 
            ? "opacity-75 bg-gray-100 border-gray-200" 
            : "hover:-translate-y-2 hover:shadow-lg cursor-pointer bg-white border-[#e2e8f0]",
          isCompleted ? "border-green-500" : "hover:border-purple-300",
          "animate-scale-in game-card"
        )}
        onClick={!isLocked ? onClick : undefined}
      >
        <div className="p-4 md:p-6 space-y-3 md:space-y-4 relative">
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 rotate-12 transform-gpu"></div>
          
          <div className={cn(
            "flex items-start justify-between",
            isMobile && "flex-col gap-2"
          )}>
            {!isMobile && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <h3 className="font-bold text-xl text-[#1e293b]">{title}</h3>
                  {isCompleted && (
                    <Award className="ml-2 text-green-500 w-5 h-5 animate-pulse" />
                  )}
                </div>
                <p className="text-base text-[#64748b] leading-relaxed line-clamp-2">{description}</p>
                
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
            )}

            {/* Mobile view shows description only */}
            {isMobile && (
              <div className="w-full">
                <p className="text-sm text-[#64748b] leading-relaxed line-clamp-2">{description}</p>
                
                {/* Difficulty indicator with stars */}
                <div className="flex items-center mt-2">
                  <span className={cn("text-xs font-medium mr-2", getDifficultyColor())}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(getDifficultyStars())].map((_, i) => (
                      <Star key={i} className={cn("w-3 h-3 fill-current", getDifficultyColor())} />
                    ))}
                    {[...Array(3 - getDifficultyStars())].map((_, i) => (
                      <Star key={i + getDifficultyStars()} className="w-3 h-3 text-gray-300" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className={cn(
              isMobile ? "flex justify-end w-full" : ""
            )}>
              {isLocked ? (
                <Lock className="w-5 h-5 text-gray-400 shrink-0" />
              ) : isCompleted ? (
                <Badge variant="success" className="px-2 py-1 text-xs animate-bounce whitespace-nowrap">
                  COMPLETE
                </Badge>
              ) : (
                <Badge className="bg-purple-100 text-purple-800 px-2 py-1 hover:bg-purple-200 transition-colors whitespace-nowrap">
                  START
                </Badge>
              )}
            </div>
          </div>
          
          {!isLocked && (
            <div className="space-y-3 md:space-y-4">
              {/* Progress bar with animated background */}
              <div className="relative">
                <Progress 
                  value={progress} 
                  className="h-2 bg-[#f1f5f9] overflow-hidden" 
                />
                {progress > 0 && progress < 100 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[slide-in-right_2s_linear_infinite] rounded-full opacity-75"></div>
                )}
              </div>
              
              <div className="flex items-center justify-start gap-3 md:gap-6 text-xs md:text-sm text-[#64748b]">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium flex items-center gap-1 group-hover:bg-purple-200 transition-colors">
                  <Gift className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  {questionsCount} {questionsCount === 1 ? 'Q' : 'Qs'}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
