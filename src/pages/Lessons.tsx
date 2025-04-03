import { useState, useEffect } from "react";
import { LessonCard } from "@/components/LessonCard";
import { LessonContent } from "@/components/LessonContent";
import { ProgressBar } from "@/components/ProgressBar";
import { Trophy, Coins, ArrowLeft, Award, Star, Gift } from "lucide-react";
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
  progress?: number;
  questions?: Question[];
  content?: string[];
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
        correctAnswer: q.correct_answer,
        explanation: q.explanation
      }))
  }));

  return lessons;
};

const Lessons = () => {
  const navigate = useNavigate();
  const [totalXP, setTotalXP] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [activeLessonContent, setActiveLessonContent] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  
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
    if (!lesson) return;
    
    // Instead of directly starting the quiz, show lesson content first
    setActiveLessonContent(lessonId);
  };

  const handleStartQuiz = () => {
    const lessonId = activeLessonContent;
    if (!lessonId) return;
    
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson?.questions && lesson.questions.length > 0) {
      setActiveQuiz(lessonId);
      setActiveLessonContent(null);
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

  const handleLessonClose = () => {
    setActiveLessonContent(null);
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

  const activeLesson = lessons.find(l => l.id === activeQuiz || l.id === activeLessonContent);
  const currentQuestion = activeLesson?.questions?.[currentQuestionIndex];

  // Sample lesson content - in a real app this would come from the database
  const lessonContent = {
    1: [
      "# Introduction to Budgeting\n\nBudgeting is the process of creating a plan for how you will spend your money. This spending plan is called a budget. Creating a budget allows you to determine in advance whether you will have enough money to do the things you need to do or would like to do.\n\nBudgeting is one of the most important financial habits you can develop.",
      "# Why Budget?\n\n- Track exactly where your money is going\n- Identify and eliminate wasteful spending\n- Save for future goals like education, vacations or retirement\n- Reduce financial stress by knowing your financial situation\n- Avoid or get out of debt",
      "# Creating a Basic Budget\n\n1. **Calculate your income**: Add up all sources of monthly income\n2. **Track your expenses**: List all your monthly expenses\n3. **Categorize spending**: Group expenses into categories like housing, food, transportation\n4. **Set goals**: Decide what you want to achieve financially"
    ],
    2: [
      "# Understanding Savings\n\nSaving money is one of the most important aspects of building wealth and having a secure financial foundation. The earlier you start saving, the better off you'll be due to the power of compound interest.",
      "# The Emergency Fund\n\nAn emergency fund is money specifically set aside for unexpected expenses or financial emergencies. Most financial experts recommend having 3-6 months of essential expenses saved in an emergency fund.\n\nThis provides a financial buffer that keeps you from relying on credit cards or high-interest loans when unexpected costs arise.",
      "# Savings Strategies\n\n- **Pay yourself first**: Set aside savings at the beginning of the month\n- **Automate transfers**: Schedule automatic transfers to savings accounts\n- **Save windfalls**: Put tax refunds, bonuses, or gifts into savings\n- **Use the 50/30/20 rule**: Allocate 50% of your budget to needs, 30% to wants, and 20% to savings"
    ],
    3: [
      "# Debt Management Basics\n\nDebt isn't inherently bad - it's a tool that can help you achieve goals when used wisely. However, poor debt management can lead to financial problems that may take years to overcome.",
      "# Types of Debt\n\n- **Good debt**: Potentially increases your net worth or generates income (e.g., mortgages, student loans, business loans)\n- **Bad debt**: Doesn't increase your wealth or generate income (e.g., credit cards, payday loans, auto loans)\n\nEven \"good debt\" becomes bad if you take on more than you can afford.",
      "# Strategies for Paying Off Debt\n\n- **Debt Avalanche**: Focus on high-interest debt first while paying minimum on others\n- **Debt Snowball**: Pay off smallest balances first for psychological wins\n- **Debt Consolidation**: Combine multiple debts into a single loan with better terms\n- **Balance Transfers**: Move high-interest credit card debt to cards with 0% intro rates"
    ]
  };

  // Add content to lessons
  const lessonsWithContent = lessons.map((lesson) => {
    return {
      ...lesson,
      content: lessonContent[lesson.id as keyof typeof lessonContent] || [
        "# Default Lesson Content\n\nThis lesson content is still being developed. Check back soon for updates!",
        "# Coming Soon\n\nWe're working on creating engaging content for this lesson. In the meantime, here are some general financial tips:\n\n- Track your spending\n- Create emergency savings\n- Pay off high-interest debt first\n- Invest early and consistently"
      ]
    };
  });

  // Find the active lesson with content
  const activeLessonWithContent = lessonsWithContent.find(l => l.id === activeLessonContent);

  const completedLessonsCount = lessons.filter(lesson => lesson.isCompleted).length;
  const totalLessonsCount = lessons.length;
  const levelProgress = calculateLevelProgress();
  const currentLevel = Math.floor(totalXP / 50) + 1;
  const xpToNextLevel = 50 - (totalXP % 50);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container py-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        {/* XP Reward Animation */}
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
        ) : activeLessonContent && activeLessonWithContent ? (
          <div>
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLessonClose}
                className="hover:bg-purple-100 text-purple-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-purple-900 ml-2">Back to Lessons</h1>
            </div>
            
            <LessonContent
              title={activeLessonWithContent.title}
              description={activeLessonWithContent.description}
              difficulty={activeLessonWithContent.difficulty}
              content={activeLessonWithContent.content || []}
              onStartQuiz={handleStartQuiz}
            />
          </div>
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
                <div className="bg-white rounded-lg p-6 shadow-md mb-8 border border-purple-100">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-purple-900">Quest Progress</h2>
                    <div className="flex items-center text-sm font-medium text-purple-600">
                      <Award className="w-4 h-4 mr-1" />
                      {completedLessonsCount}/{totalLessonsCount} Completed
                    </div>
                  </div>
                  <ProgressBar
                    progress={completedLessonsCount}
                    total={totalLessonsCount}
                    className="max-w-full"
                  />
                </div>

                <div className="space-y-8">
                  {lessonsWithContent.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      title={lesson.title}
                      description={lesson.description}
                      xp={lesson.xp}
                      difficulty={lesson.difficulty}
                      isCompleted={lesson.isCompleted}
                      onClick={() => handleLessonClick(lesson.id, index > 0 && !lessonsWithContent[index - 1].isCompleted)}
                      number={index + 1}
                      progress={lesson.isCompleted ? 100 : 0}
                      isLocked={index > 0 && !lessonsWithContent[index - 1].isCompleted}
                      isLast={index === lessonsWithContent.length - 1}
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
