import { useState } from "react";
import { LessonCard } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Trophy, Coins } from "lucide-react";
import { Quiz } from "@/components/Quiz";

interface Lesson {
  id: number;
  title: string;
  description: string;
  xp: number;
  difficulty: "easy" | "medium" | "hard";
  isCompleted: boolean;
  questions?: Array<{
    title: string;
    options: string[];
    correctAnswer: string;
  }>;
}

const Lessons = () => {
  const [totalXP, setTotalXP] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "Budgeting Basics",
      description: "Learn the fundamentals of creating and maintaining a budget",
      xp: 20,
      difficulty: "easy",
      isCompleted: false,
      questions: [
        {
          title: "What is the primary purpose of creating a budget?",
          options: [
            "To track daily expenses",
            "To plan and control spending",
            "To save money for retirement",
            "To invest in stocks"
          ],
          correctAnswer: "To plan and control spending"
        },
        {
          title: "Which of these is a key component of a basic budget?",
          options: [
            "Stock portfolio",
            "Monthly income",
            "Cryptocurrency investments",
            "Real estate assets"
          ],
          correctAnswer: "Monthly income"
        }
      ]
    },
    {
      id: 2,
      title: "Saving Strategies",
      description: "Discover effective methods to save money and build wealth",
      xp: 25,
      difficulty: "easy",
      isCompleted: false,
      questions: [
        {
          title: "What is the difference between a savings account and a checking account?",
          options: [
            "Savings accounts offer higher interest rates",
            "Checking accounts are more flexible for daily transactions",
            "Savings accounts are only for short-term investments",
            "Checking accounts offer better security"
          ],
          correctAnswer: "Checking accounts are more flexible for daily transactions"
        },
        {
          title: "What is the rule of 72?",
          options: [
            "It is a formula to calculate the number of years it takes to double an investment",
            "It is a rule to calculate the number of years it takes to triple an investment",
            "It is a rule to calculate the number of years it takes to quadruple an investment",
            "It is a rule to calculate the number of years it takes to quintuple an investment"
          ],
          correctAnswer: "It is a formula to calculate the number of years it takes to double an investment"
        }
      ]
    },
    {
      id: 3,
      title: "Investment 101",
      description: "Introduction to different types of investments",
      xp: 30,
      difficulty: "medium",
      isCompleted: false,
      questions: [
        {
          title: "What is the difference between stocks and bonds?",
          options: [
            "Stocks are traded on the stock market and provide the potential for higher returns",
            "Bonds are issued by governments and corporations and provide a fixed income",
            "Stocks are issued by governments and corporations and provide a fixed income",
            "Bonds are traded on the stock market and provide the potential for higher returns"
          ],
          correctAnswer: "Stocks are traded on the stock market and provide the potential for higher returns"
        },
        {
          title: "What is the difference between a mutual fund and a stock?",
          options: [
            "Mutual funds are a collection of stocks, while stocks are individual shares",
            "Mutual funds are a collection of bonds, while stocks are individual shares",
            "Mutual funds are a collection of stocks, while bonds are individual shares",
            "Mutual funds are a collection of bonds, while stocks are individual shares"
          ],
          correctAnswer: "Mutual funds are a collection of stocks, while stocks are individual shares"
        }
      ]
    },
    {
      id: 4,
      title: "Stock Market Basics",
      description: "Understanding how the stock market works",
      xp: 40,
      difficulty: "hard",
      isCompleted: false,
      questions: [
        {
          title: "What is the difference between a bull market and a bear market?",
          options: [
            "A bull market is when the stock market is rising, while a bear market is when the stock market is falling",
            "A bull market is when the stock market is falling, while a bear market is when the stock market is rising",
            "A bull market is when the stock market is rising, while a bear market is when the stock market is stable",
            "A bull market is when the stock market is stable, while a bear market is when the stock market is falling"
          ],
          correctAnswer: "A bull market is when the stock market is rising, while a bear market is when the stock market is falling"
        },
        {
          title: "What is the difference between a primary market and a secondary market?",
          options: [
            "A primary market is when a company issues new shares, while a secondary market is when existing shares are traded",
            "A primary market is when existing shares are traded, while a secondary market is when a company issues new shares",
            "A primary market is when a company issues new bonds, while a secondary market is when existing bonds are traded",
            "A primary market is when existing bonds are traded, while a secondary market is when a company issues new bonds"
          ],
          correctAnswer: "A primary market is when a company issues new shares, while a secondary market is when existing shares are traded"
        }
      ]
    },
  ]);

  const handleLessonClick = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson?.questions) {
      setActiveQuiz(lessonId);
      setCurrentQuestionIndex(0);
    }
  };

  const handleQuizComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      const lesson = lessons.find(l => l.id === activeQuiz);
      if (lesson && !lesson.isCompleted) {
        setTotalXP(prev => prev + lesson.xp);
        setLessons(prevLessons =>
          prevLessons.map(l =>
            l.id === activeQuiz ? { ...l, isCompleted: true } : l
          )
        );
      }
    }
  };

  const handleQuizClose = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
  };

  const activeLesson = lessons.find(l => l.id === activeQuiz);
  const currentQuestion = activeLesson?.questions?.[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8 animate-fade-in">
        {activeQuiz && currentQuestion ? (
          <Quiz
            question={currentQuestion}
            onComplete={handleQuizComplete}
            onClose={handleQuizClose}
          />
        ) : (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Financial Education
                </h1>
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
              <ProgressBar
                progress={totalXP % 50}
                total={50}
                className="max-w-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  title={lesson.title}
                  description={lesson.description}
                  xp={lesson.xp}
                  difficulty={lesson.difficulty}
                  isCompleted={lesson.isCompleted}
                  onClick={() => handleLessonClick(lesson.id)}
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
