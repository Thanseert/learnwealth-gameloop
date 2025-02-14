
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  title: string;
  description: string;
  xp: number;
  difficulty: "easy" | "medium" | "hard";
  isCompleted?: boolean;
  onClick?: () => void;
}

export function LessonCard({
  title,
  description,
  xp,
  difficulty,
  isCompleted = false,
  onClick,
}: LessonCardProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        "cursor-pointer transform hover:-translate-y-1",
        "animate-scale-in"
      )}
      onClick={onClick}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn(difficultyColors[difficulty], "capitalize")}
          >
            {difficulty}
          </Badge>
          <Badge variant="secondary">
            {xp} XP
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {isCompleted && (
          <Badge variant="success" className="absolute top-3 right-3">
            Completed
          </Badge>
        )}
      </div>
    </Card>
  );
}
