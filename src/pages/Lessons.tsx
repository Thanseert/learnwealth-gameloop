import { useState } from "react";
import { LessonCard } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Trophy, Coins } from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
        },
        {
          title: "How often should you review and adjust your budget?",
          options: [
            "Once a year",
            "Monthly",
            "Never",
            "Only when having financial problems"
          ],
          correctAnswer: "Monthly"
        },
        {
          title: "What is a zero-based budget?",
          options: [
            "A budget where you spend everything you earn",
            "A budget where every dollar has a purpose",
            "A budget with no savings",
            "A budget starting from zero"
          ],
          correctAnswer: "A budget where every dollar has a purpose"
        },
        {
          title: "What should be your first step in creating a budget?",
          options: [
            "Calculate your total income",
            "List your expenses",
            "Set financial goals",
            "Start saving money"
          ],
          correctAnswer: "Calculate your total income"
        },
        {
          title: "What is the 50/30/20 budgeting rule?",
          options: [
            "50% savings, 30% needs, 20% wants",
            "50% needs, 30% wants, 20% savings",
            "50% needs, 30% savings, 20% wants",
            "50% wants, 30% needs, 20% savings"
          ],
          correctAnswer: "50% needs, 30% wants, 20% savings"
        },
        {
          title: "Which category is typically the largest expense in a household budget?",
          options: [
            "Food",
            "Housing",
            "Entertainment",
            "Transportation"
          ],
          correctAnswer: "Housing"
        },
        {
          title: "What is an emergency fund?",
          options: [
            "Money set aside for vacations",
            "Savings for large purchases",
            "Money for unexpected expenses",
            "Investment in stocks"
          ],
          correctAnswer: "Money for unexpected expenses"
        },
        {
          title: "How many months of expenses should an emergency fund ideally cover?",
          options: [
            "1-2 months",
            "3-6 months",
            "7-9 months",
            "10-12 months"
          ],
          correctAnswer: "3-6 months"
        },
        {
          title: "What is discretionary income?",
          options: [
            "Total monthly income",
            "Money left after paying taxes",
            "Money left after paying essential expenses",
            "Money spent on necessities"
          ],
          correctAnswer: "Money left after paying essential expenses"
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
          title: "What is compound interest?",
          options: [
            "Interest earned only on the principal amount",
            "Interest earned on both principal and accumulated interest",
            "A fixed interest rate that never changes",
            "Interest paid to creditors"
          ],
          correctAnswer: "Interest earned on both principal and accumulated interest"
        },
        {
          title: "Which saving strategy is best for short-term goals?",
          options: [
            "High-yield savings account",
            "Long-term investment in stocks",
            "Real estate investment",
            "Retirement account"
          ],
          correctAnswer: "High-yield savings account"
        },
        {
          title: "What is the pay yourself first strategy?",
          options: [
            "Spending money on yourself before bills",
            "Saving before spending on expenses",
            "Paying bills before saving",
            "Investing in yourself through education"
          ],
          correctAnswer: "Saving before spending on expenses"
        },
        {
          title: "What is a good percentage of income to save each month?",
          options: [
            "5% or less",
            "10-15%",
            "20% or more",
            "50% or more"
          ],
          correctAnswer: "20% or more"
        },
        {
          title: "What is dollar-cost averaging?",
          options: [
            "Investing a fixed amount regularly regardless of price",
            "Buying when prices are low",
            "Selling when prices are high",
            "Converting dollars to other currencies"
          ],
          correctAnswer: "Investing a fixed amount regularly regardless of price"
        },
        {
          title: "Which account typically offers the highest interest rate?",
          options: [
            "Checking account",
            "Traditional savings account",
            "Certificate of Deposit (CD)",
            "Money market account"
          ],
          correctAnswer: "Certificate of Deposit (CD)"
        },
        {
          title: "What is the rule of 72?",
          options: [
            "A formula to calculate monthly savings",
            "Years needed to double money at a given interest rate",
            "Percentage of income to save",
            "Number of months to reach a savings goal"
          ],
          correctAnswer: "Years needed to double money at a given interest rate"
        },
        {
          title: "What is a common barrier to saving money?",
          options: [
            "Having too much income",
            "Lifestyle inflation",
            "Low interest rates",
            "Having a budget"
          ],
          correctAnswer: "Lifestyle inflation"
        },
        {
          title: "What is the purpose of an emergency fund?",
          options: [
            "To earn high returns",
            "To protect against unexpected expenses",
            "To save for retirement",
            "To invest in stocks"
          ],
          correctAnswer: "To protect against unexpected expenses"
        },
        {
          title: "Which is a characteristic of a good savings goal?",
          options: [
            "Vague and flexible",
            "Specific and measurable",
            "Quick and easy",
            "Complex and challenging"
          ],
          correctAnswer: "Specific and measurable"
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
          title: "What is diversification in investing?",
          options: [
            "Investing all money in one stock",
            "Spreading investments across different assets",
            "Only investing in safe options",
            "Investing in cryptocurrency only"
          ],
          correctAnswer: "Spreading investments across different assets"
        },
        {
          title: "What is a stock?",
          options: [
            "A loan to a company",
            "Ownership share in a company",
            "A government bond",
            "A savings account"
          ],
          correctAnswer: "Ownership share in a company"
        },
        {
          title: "What is a bond?",
          options: [
            "A type of stock",
            "A loan to a government or company",
            "A savings account",
            "A cryptocurrency"
          ],
          correctAnswer: "A loan to a government or company"
        },
        {
          title: "What is an ETF?",
          options: [
            "A single stock",
            "A bundle of investments that trades like a stock",
            "A type of savings account",
            "A government bond"
          ],
          correctAnswer: "A bundle of investments that trades like a stock"
        },
        {
          title: "What is the main advantage of a mutual fund?",
          options: [
            "Guaranteed returns",
            "Professional management",
            "No risk",
            "Higher returns than stocks"
          ],
          correctAnswer: "Professional management"
        },
        {
          title: "What is asset allocation?",
          options: [
            "Putting all money in stocks",
            "Dividing investments among different asset types",
            "Only investing in bonds",
            "Keeping all money in cash"
          ],
          correctAnswer: "Dividing investments among different asset types"
        },
        {
          title: "What is market capitalization?",
          options: [
            "The total value of a company's shares",
            "The price of one share",
            "The company's profit",
            "The company's debt"
          ],
          correctAnswer: "The total value of a company's shares"
        },
        {
          title: "What is a dividend?",
          options: [
            "A type of stock",
            "A payment to shareholders",
            "A type of bond",
            "A market index"
          ],
          correctAnswer: "A payment to shareholders"
        },
        {
          title: "What is the S&P 500?",
          options: [
            "A single company's stock",
            "An index of 500 large US companies",
            "A type of bond",
            "A mutual fund"
          ],
          correctAnswer: "An index of 500 large US companies"
        },
        {
          title: "What is the primary benefit of long-term investing?",
          options: [
            "Quick profits",
            "Compound growth over time",
            "No risk",
            "Guaranteed returns"
          ],
          correctAnswer: "Compound growth over time"
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
          title: "What is a bull market?",
          options: [
            "Market is trending down",
            "Market is trending up",
            "Market is stable",
            "Market is closed"
          ],
          correctAnswer: "Market is trending up"
        },
        {
          title: "What is a bear market?",
          options: [
            "Market is trending up",
            "Market is trending down",
            "Market is stable",
            "Market is volatile"
          ],
          correctAnswer: "Market is trending down"
        },
        {
          title: "What is volatility in the stock market?",
          options: [
            "Steady price movements",
            "No price changes",
            "Rapid and significant price changes",
            "Gradual price increases"
          ],
          correctAnswer: "Rapid and significant price changes"
        },
        {
          title: "What is a P/E ratio?",
          options: [
            "Price divided by earnings",
            "Profit divided by expenses",
            "Price divided by equity",
            "Profit divided by equity"
          ],
          correctAnswer: "Price divided by earnings"
        },
        {
          title: "What is market order?",
          options: [
            "Buy/sell at a specific price",
            "Buy/sell at the current market price",
            "Buy/sell at a future date",
            "Buy/sell with conditions"
          ],
          correctAnswer: "Buy/sell at the current market price"
        },
        {
          title: "What is a limit order?",
          options: [
            "Buy/sell at market price",
            "Buy/sell at a specific price or better",
            "Buy/sell at any price",
            "Buy/sell at closing price"
          ],
          correctAnswer: "Buy/sell at a specific price or better"
        },
        {
          title: "What is a blue-chip stock?",
          options: [
            "New company stock",
            "High-risk stock",
            "Established, financially sound company stock",
            "Penny stock"
          ],
          correctAnswer: "Established, financially sound company stock"
        },
        {
          title: "What is a stock split?",
          options: [
            "Company dividing existing shares into multiple shares",
            "Company buying back shares",
            "Company issuing new shares",
            "Company merging shares"
          ],
          correctAnswer: "Company dividing existing shares into multiple shares"
        },
        {
          title: "What is market capitalization?",
          options: [
            "Company's debt",
            "Company's revenue",
            "Total value of company's outstanding shares",
            "Company's profit"
          ],
          correctAnswer: "Total value of company's outstanding shares"
        },
        {
          title: "What is insider trading?",
          options: [
            "Trading during market hours",
            "Trading based on public information",
            "Trading based on non-public information",
            "Trading with a broker"
          ],
          correctAnswer: "Trading based on non-public information"
        }
      ]
    },
  ]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/");
    }
  }, [navigate]);

  const handleLessonClick = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson?.questions) {
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
        if (!activeLesson?.isCompleted) {
          setLessons(prevLessons =>
            prevLessons.map(l =>
              l.id === activeQuiz ? { ...l, isCompleted: true } : l
            )
          );
        }
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
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={activeLesson?.questions?.length || 0}
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
