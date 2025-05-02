
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
  lessonId: number;
  onBack: () => void;
}

export function LessonContent({
  title,
  description,
  difficulty,
  lessonId,
  onBack,
}: LessonContentProps) {
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  
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

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-[50vh] md:min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base md:text-lg text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] md:min-h-[70vh] animate-fade-in p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-900 mb-4">{title}</h1>
        <div className="flex items-center gap-3 mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-medium 
            ${difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
              difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
        
        <div className="prose max-w-none mb-8">
          <p className="text-gray-700">{description}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Button onClick={onBack} variant="outline">
            Back to Lessons
          </Button>
        </div>
      </div>
    </div>
  );
}
