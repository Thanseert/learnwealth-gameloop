import { useState, useEffect } from "react";
import { LessonCard } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Trophy, Coins, ArrowLeft } from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Leaderboard } from "@/components/Leaderboard";

interface Question {
  id: number;
  title: string;
  options: string[];
  correct_answer: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  xp: number;
  difficulty: "easy" | "medium" | "hard";
  isCompleted: boolean;
  progress?: number;
  questions?: Question[];
}

interface CompletedLesson {
  lesson_id: number;
  user_id: string;
}

const fetchLessonsAndQuestions = async () => {
  const { data: lessonsData, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .order('order');

  if (lessonsError) throw lessonsError;

  const { data: questionsData, error: questionsError } = await supabase
    .from('questions')
    .select('*');

  if (questionsError) throw questionsError;

  const { data: { session } } = await supabase.auth.getSession();
  let completedLessonIds: number[] = [];
  
  if (session?.user?.id) {
    const { data: completedLessonsData, error: completedLessonsError } = await supabase
      .rpc('get_completed_lessons', { user_id_param: session.user.id });
      
    if (completedLessonsError) {
      console.error('Error fetching completed lessons:', completedLessonsError);
    } else if (completedLessonsData) {
      completedLessonIds = completedLessonsData.map((item: { lesson_id: number }) => item.lesson_id);
    }
  }

  const lessons = lessonsData.map((lesson: any) => ({
    ...lesson,
    isCompleted: completedLessonIds.includes(lesson.id),
    questions: questionsData
      .filter((q: any) => q.lesson_id === lesson.id)
      .map((q: any) => ({
        id: q.id,
        title: q.title,
        options: q.options,
        correctAnswer: q.correct_answer
      }))
  }));

  return lessons;
};

const Lessons = () => {
  const navigate = useNavigate();
  const [totalXP, setTotalXP] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  
  const { data: lessons = [], isLoading, error, refetch } = useQuery({
    queryKey: ['lessons'],
    queryFn: fetchLessonsAndQuestions
  });

  const [completedLessons, setCompletedLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to access lessons');
        navigate('/auth');
        return;
      }
      
      setUserId(session.user.id);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Error loading user profile');
        return;
      }
      
      if (profile) {
        setTotalXP(profile.xp || 0);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLessonClick = (lessonId: number, isLocked: boolean) => {
    if (isLocked) {
      toast.error('Complete the previous lesson to unlock this one');
      return;
    }
    
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson?.questions && lesson.questions.length > 0) {
      setActiveQuiz(lessonId);
      setCurrentQuestionIndex(0);
    } else {
      toast.error('No questions available for this lesson');
    }
  };

  const handleQuizComplete = async (isCorrect: boolean) => {
    if (isCorrect && userId) {
      try {
        const activeLesson = lessons.find(l => l.id === activeQuiz);
        if (!activeLesson) return;
        
        const isLessonAlreadyCompleted = activeLesson.isCompleted;
        
        if (activeLesson?.questions && currentQuestionIndex < activeLesson.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          return;
        }
        
        if (!isLessonAlreadyCompleted) {
          const earnedXP = activeLesson.xp || 5;
          
          const { data: currentData, error: fetchError } = await supabase
            .from('profiles')
            .select('xp')
            .eq('id', userId)
            .single();
            
          if (fetchError) {
            console.error('Error fetching current XP:', fetchError);
            toast.error('Failed to update XP');
            return;
          }
          
          const currentXP = currentData?.xp || 0;
          const updatedXP = currentXP + earnedXP;
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ xp: updatedXP })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating XP:', updateError);
            toast.error('Failed to update XP');
            return;
          }
          
          const { error: completionError } = await supabase
            .rpc('record_lesson_completion', { 
              user_id_param: userId,
              lesson_id_param: activeLesson.id
            });
            
          if (completionError) {
            console.error('Error recording lesson completion:', completionError);
            toast.error('Failed to record lesson completion');
            return;
          }
          
          setTotalXP(updatedXP);
          toast.success(`Lesson completed! +${earnedXP} XP earned!`);
          
          refetch();
        } else {
          toast.info('You already completed this lesson (no additional XP earned)');
        }
        
        setActiveQuiz(null);
        setCurrentQuestionIndex(0);
        
      } catch (err) {
        console.error('Error in quiz completion flow:', err);
        toast.error('Something went wrong. Please try again.');
      }
    } else if (!isCorrect) {
      toast.error('Try again!');
    }
  };

  const handleQuizClose = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
  };

  const calculateLevelProgress = () => {
    const xpPerLevel = 50;
    const currentLevelXP = totalXP % xpPerLevel;
    return currentLevelXP;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading lessons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading lessons. Please try again later.</div>
      </div>
    );
  }

  const activeLesson = lessons.find(l => l.id === activeQuiz);
  const currentQuestion = activeLesson?.questions?.[currentQuestionIndex];

  const completedLessonsCount = lessons.filter(lesson => lesson.isCompleted).length;
  const totalLessonsCount = lessons.length;
  const levelProgress = calculateLevelProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        {activeQuiz && currentQuestion ? (
          <Quiz
            question={{
              title: currentQuestion.title,
              options: currentQuestion.options,
              correctAnswer: currentQuestion.correctAnswer
            }}
            onComplete={handleQuizComplete}
            onClose={handleQuizClose}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={activeLesson?.questions?.length || 0}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Financial Education
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{totalXP} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Level {Math.floor(totalXP / 50) + 1}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                  <h2 className="text-xl font-semibold mb-2">Course Progress</h2>
                  <ProgressBar
                    progress={levelProgress}
                    total={50}
                    className="max-w-full"
                  />
                </div>

                <div className="space-y-8">
                  {lessons.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      title={lesson.title}
                      description={lesson.description}
                      xp={lesson.xp}
                      difficulty={lesson.difficulty}
                      isCompleted={lesson.isCompleted}
                      onClick={() => handleLessonClick(lesson.id, index > 0 && !lessons[index - 1].isCompleted)}
                      number={index + 1}
                      progress={lesson.isCompleted ? 100 : 0}
                      isLocked={index > 0 && !lessons[index - 1].isCompleted}
                      isLast={index === lessons.length - 1}
                      questionsCount={lesson.questions?.length || 0}
                    />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <Leaderboard />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lessons;
