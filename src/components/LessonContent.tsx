
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaderboard } from "@/components/Leaderboard";
import { Trophy, ChevronUp } from "lucide-react";

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
        const defaultQuizId = lessonId;
        
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

  // Mobile Leaderboard Component
  const MobileLeaderboard = () => {
    if (!isMobile) return null;
    
    return (
      <div className="fixed bottom-0 left-0 right-0 z-10">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 rounded-t-lg shadow-lg border-t border-x border-yellow-300"
              >
                <Trophy className="h-5 w-5 mr-2" />
                <span>View Leaderboard</span>
                <ChevronUp className="h-5 w-5 ml-2" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="p-0 pt-0 max-h-[80vh] overflow-auto rounded-t-xl">
              <div className="p-4">
                <Leaderboard />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 rounded-t-lg shadow-lg border-t border-x border-yellow-300"
              >
                <Trophy className="h-5 w-5 mr-2" />
                <span>View Leaderboard</span>
                <ChevronUp className="h-5 w-5 ml-2" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <div className="p-4 pt-2">
                <Leaderboard />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    );
  };

  // Always show the "Starting quiz" screen with mobile leaderboard
  return (
    <div className="min-h-[50vh] md:min-h-[70vh] flex flex-col items-center justify-center animate-fade-in p-4">
      <p className="text-base md:text-lg text-gray-600 mb-4 text-center">Starting quiz...</p>
      <Button onClick={onBack} variant="outline" className="w-full md:w-auto">
        Back to Lessons
      </Button>
      <MobileLeaderboard />
    </div>
  );
}
