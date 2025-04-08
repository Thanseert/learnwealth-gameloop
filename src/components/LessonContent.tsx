
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    return <div className="min-h-[70vh] flex items-center justify-center">Loading quiz...</div>;
  }

  // Always show the "Starting quiz" screen
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in">
      <p className="text-lg text-gray-600 mb-4">Starting quiz...</p>
      <Button onClick={onBack} variant="outline">
        Back to Lessons
      </Button>
    </div>
  );
}
