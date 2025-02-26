
import { useState, useEffect } from "react";
import { LessonCard } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Trophy, Coins, ArrowLeft } from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

const fetchLessonsAndQuestions = async () => {
  // Fetch lessons
  const { data: lessonsData, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .order('order');

  if (lessonsError) throw lessonsError;

  // Fetch questions for all lessons
  const { data: questionsData, error: questionsError } = await supabase
    .from('questions')
    .select('*');

  if (questionsError) throw questionsError;

  // Organize questions by lesson
  const lessons = lessonsData.map((lesson: any) => ({
    ...lesson,
    isCompleted: false,
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
  
  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: fetchLessonsAndQuestions
  });

  const [completedLessons, setCompletedLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/");
    }
  }, [navigate]);

  const handleLessonClick = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson?.questions && lesson.questions.length > 0) {
      setActiveQuiz(lessonId);
      setCurrentQuestionIndex(0);
    }
  };

  const handleQuizComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      // Award 5XP for each correct answer
      setTotalXP(prev => prev + 5);
      
      // Move to next question if available
      const activeLesson = lessons.find(l => l.id === activeQuiz);
      if (activeLesson?.questions && currentQuestionIndex < activeLesson.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // If it's the last question, mark lesson as complete
        const updatedLessons = lessons.map(l =>
          l.id === activeQuiz ? { ...l, isCompleted: true } : l
        );
        setCompletedLessons(updatedLessons.filter(l => l.isCompleted));
        // Reset quiz state
        setActiveQuiz(null);
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handleQuizClose = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        {activeQuiz && currentQuestion ? (
          <Quiz
            question={currentQuestion}
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

            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-2">Course Progress</h2>
              <ProgressBar
                progress={totalXP % 50}
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
                  onClick={() => handleLessonClick(lesson.id)}
                  number={index + 1}
                  progress={lesson.isCompleted ? 100 : (lesson.progress || 0)}
                  isLocked={index > 0 && !lessons[index - 1].isCompleted}
                  isLast={index === lessons.length - 1}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lessons;
