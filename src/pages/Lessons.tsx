
import { useEffect, useState } from "react";
import { LessonCard } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Trophy, Coins } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  xp: number;
  difficulty: "easy" | "medium" | "hard";
  isCompleted: boolean;
}

const Lessons = () => {
  const [totalXP, setTotalXP] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "Budgeting Basics",
      description: "Learn the fundamentals of creating and maintaining a budget",
      xp: 20,
      difficulty: "easy",
      isCompleted: false,
    },
    {
      id: 2,
      title: "Saving Strategies",
      description: "Discover effective methods to save money and build wealth",
      xp: 25,
      difficulty: "easy",
      isCompleted: false,
    },
    {
      id: 3,
      title: "Investment 101",
      description: "Introduction to different types of investments",
      xp: 30,
      difficulty: "medium",
      isCompleted: false,
    },
    {
      id: 4,
      title: "Stock Market Basics",
      description: "Understanding how the stock market works",
      xp: 40,
      difficulty: "hard",
      isCompleted: false,
    },
  ]);

  const handleLessonClick = (lessonId: number) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === lessonId
          ? { ...lesson, isCompleted: true }
          : lesson
      )
    );
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson && !lesson.isCompleted) {
      setTotalXP((prev) => prev + lesson.xp);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8 animate-fade-in">
        {/* Header Section */}
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

        {/* Lessons Grid */}
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
      </div>
    </div>
  );
};

export default Lessons;
