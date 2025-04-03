
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, BookOpen, Star, ListTodo } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SubLesson {
  id: number;
  title: string;
  content: string[];
}

interface LessonContentProps {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  subLessons: SubLesson[];
  onStartQuiz: (subLessonId: number) => void;
  onBack: () => void;
}

export function LessonContent({
  title,
  description,
  difficulty,
  subLessons,
  onStartQuiz,
  onBack,
}: LessonContentProps) {
  const [selectedSubLesson, setSelectedSubLesson] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };
  
  const getDifficultyStars = () => {
    switch (difficulty) {
      case "easy":
        return 1;
      case "medium":
        return 2;
      case "hard":
        return 3;
      default:
        return 1;
    }
  };

  const handleNext = () => {
    const currentSubLesson = subLessons.find(sl => sl.id === selectedSubLesson);
    if (currentSubLesson && currentPage < currentSubLesson.content.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (selectedSubLesson !== null) {
      onStartQuiz(selectedSubLesson);
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      // If we're on the first page, go back to the sub-lesson selection
      setSelectedSubLesson(null);
    }
  };

  const handleSelectSubLesson = (subLessonId: number) => {
    setSelectedSubLesson(subLessonId);
    setCurrentPage(0);
  };

  // If no sub-lesson is selected, show the list of sub-lessons
  if (selectedSubLesson === null) {
    return (
      <div className="min-h-[70vh] flex flex-col animate-fade-in">
        <div className="mb-6 flex items-center gap-2">
          <h1 className="text-2xl font-bold text-purple-900">{title}</h1>
          <div className="flex items-center">
            <span className={`${getDifficultyColor()} ml-2 font-medium`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            <div className="flex space-x-1 ml-2">
              {[...Array(getDifficultyStars())].map((_, i) => (
                <Star key={i} className={`w-4 h-4 fill-current ${getDifficultyColor()}`} />
              ))}
              {[...Array(3 - getDifficultyStars())].map((_, i) => (
                <Star key={i + getDifficultyStars()} className="w-4 h-4 text-gray-300" />
              ))}
            </div>
          </div>
        </div>
        
        <p className="mb-6 text-gray-600">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {subLessons.map((subLesson) => (
            <Card 
              key={subLesson.id} 
              className="p-6 hover:shadow-md transition-shadow cursor-pointer bg-white border border-purple-100"
              onClick={() => handleSelectSubLesson(subLesson.id)}
            >
              <div className="flex items-center gap-3">
                <ListTodo className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-lg">{subLesson.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {subLesson.content.length} {subLesson.content.length === 1 ? 'page' : 'pages'}
              </p>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between mt-auto">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="px-6"
          >
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  // If a sub-lesson is selected, show the sub-lesson content
  const currentSubLesson = subLessons.find(sl => sl.id === selectedSubLesson);
  if (!currentSubLesson) {
    return <div>Sub-lesson not found</div>;
  }

  return (
    <div className="min-h-[70vh] flex flex-col animate-fade-in">
      <div className="mb-6 flex items-center gap-2">
        <h1 className="text-2xl font-bold text-purple-900">{currentSubLesson.title}</h1>
      </div>
      
      <Card className="p-8 flex-grow mb-8 bg-white shadow-lg border-purple-100">
        <div className="prose max-w-none">
          <div className="flex items-center mb-4">
            <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Lesson Content</h2>
          </div>
          
          <div className="whitespace-pre-wrap text-lg">
            {currentSubLesson.content[currentPage]}
          </div>
        </div>
      </Card>
      
      <div className="flex flex-col space-y-4">
        <Progress value={(currentPage + 1) * 100 / currentSubLesson.content.length} className="h-2" />
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Page {currentPage + 1} of {currentSubLesson.content.length}</span>
          <span className="text-sm text-gray-600">{Math.round((currentPage + 1) * 100 / currentSubLesson.content.length)}% Complete</span>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            className="px-6"
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleNext} 
            className={`px-6 ${currentPage === currentSubLesson.content.length - 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {currentPage === currentSubLesson.content.length - 1 ? 'Start Quiz' : 'Next'} 
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
