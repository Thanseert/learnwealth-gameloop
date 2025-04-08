
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface SubLesson {
  id: number;
  title: string;
  content: string[];
}

interface LessonContentProps {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  lessonId: number; // Used to fetch sub-lessons from database
  onStartQuiz: (subLessonId: number) => void;
  onBack: () => void;
}

export function LessonContent({
  title,
  description,
  difficulty,
  lessonId,
  onStartQuiz,
  onBack,
}: LessonContentProps) {
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const startQuiz = async () => {
      try {
        setLoading(true);
        // Use a default quiz ID based on the lesson ID
        const defaultQuizId = lessonId * 100;
        
        // Short delay to ensure UI is ready
        setTimeout(() => {
          onStartQuiz(defaultQuizId);
        }, 100);
      } catch (err) {
        console.error('Error starting quiz:', err);
        toast.error('Failed to start quiz');
      } finally {
        setLoading(false);
      }
    };
    
    // Start the quiz immediately for all lessons
    startQuiz();
  }, [lessonId, onStartQuiz]);
  
  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-[50vh] md:min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base md:text-lg text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Always show the "Starting quiz" screen
  return (
    <div className="min-h-[50vh] md:min-h-[70vh] flex flex-col items-center justify-center animate-fade-in p-4">
      <p className="text-base md:text-lg text-gray-600 mb-4 text-center">Starting quiz...</p>
      <Button onClick={onBack} variant="outline" className="w-full md:w-auto">
        Back to Lessons
      </Button>
    </div>
  );
}
