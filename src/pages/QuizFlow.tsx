
import { useState, useEffect } from "react";
import { LessonCard } from "@/components/LessonCard";
import { Quiz } from "@/components/Quiz";
import { ArrowLeft, Trophy, Star, Coins } from "lucide-react";
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
  correctAnswer: string;
  explanation?: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  xp: number;
  difficulty: "easy" | "medium" | "hard";
  isCompleted: boolean;
  questions: Question[];
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

  // Group questions by lesson
  const questionsByLesson = questionsData.reduce((acc: {[key: number]: Question[]}, q: any) => {
    if (!acc[q.lesson_id]) {
      acc[q.lesson_id] = [];
    }
    acc[q.lesson_id].push({
      id: q.id,
      title: q.title,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation
    });
    return acc;
  }, {});

  // Map lessons with their questions
  const lessons = lessonsData.map((lesson: any) => ({
    ...lesson,
    isCompleted: completedLessonIds.includes(lesson.id),
    questions: questionsByLesson[lesson.id] || []
  }));

  return lessons;
};

const QuizFlow = () => {
  const navigate = useNavigate();
  const [totalXP, setTotalXP] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  
  const { data: lessons = [], isLoading, error, refetch } = useQuery({
    queryKey: ['lessons'],
    queryFn: fetchLessonsAndQuestions
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to access quizzes');
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
    
    setActiveQuiz(lessonId);
    setCurrentQuestionIndex(0);
  };

  const handleQuizComplete = async (isCorrect: boolean) => {
    if (!activeQuiz || !userId) return;
    
    if (isCorrect) {
      try {
        const activeLesson = lessons.find(l => l.id === activeQuiz);
        if (!activeLesson) return;
        
        const questions = activeLesson.questions || [];
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          return;
        }
        
        const isLessonAlreadyCompleted = activeLesson.isCompleted;
        
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
          setShowRewardAnimation(true);
          
          setTimeout(() => {
            setShowRewardAnimation(false);
          }, 3000);
          
          toast.success(`Level completed! +${earnedXP} XP earned!`, {
            icon: <Trophy className="text-yellow-500 h-5 w-5" />
          });
          
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
    const currentLevel = Math.floor(totalXP / xpPerLevel) + 1;
    const xpInCurrentLevel = totalXP % xpPerLevel;
    const progressPercentage = (xpInCurrentLevel / xpPerLevel) * 100;
    return progressPercentage;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-purple-400 rounded-full mb-4 animate-bounce"></div>
          <div className="text-purple-800 font-bold">Loading your adventure...</div>
        </div>
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
  let currentQuestion: Question | undefined;
  
  if (activeQuiz && activeLesson && activeLesson.questions) {
    currentQuestion = activeLesson.questions[currentQuestionIndex];
  }

  const completedLessonsCount = lessons.filter(lesson => lesson.isCompleted).length;
  const totalLessonsCount = lessons.length;
  const levelProgress = calculateLevelProgress();
  const currentLevel = Math.floor(totalXP / 50) + 1;
  const xpToNextLevel = 50 - (totalXP % 50);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container py-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        {showRewardAnimation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="relative">
              <div className="text-6xl font-bold text-yellow-500 animate-ping mb-20">
                +{activeLesson?.xp} XP
              </div>
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 20 + 5}px`,
                    height: `${Math.random() * 20 + 5}px`,
                    backgroundColor: `hsl(${Math.random() * 60 + 40}, 100%, 50%)`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `fall-${i % 5} 3s ease-out infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeQuiz && currentQuestion ? (
          <Quiz
            question={{
              title: currentQuestion.title,
              options: currentQuestion.options,
              correctAnswer: currentQuestion.correctAnswer,
              explanation: currentQuestion.explanation
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
                  className="hover:bg-purple-100 text-purple-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-3xl font-bold text-purple-900">
                  Financial Adventure
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-purple-100 px-3 py-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-800">{totalXP} XP</span>
                </div>
                <div className="flex flex-col items-center bg-yellow-100 px-3 py-1 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="font-bold text-yellow-800">Level {currentLevel}</span>
                  </div>
                  <div className="text-xs text-yellow-600">
                    {xpToNextLevel} XP to next level
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
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
                      questionsCount={lesson.questions.length}
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

export default QuizFlow;
