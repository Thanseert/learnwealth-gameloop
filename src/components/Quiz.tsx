
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QuizProps {
  question: {
    title: string;
    options: string[];
    correctAnswer: string;
  };
  onComplete: (isCorrect: boolean) => void;
  onClose: () => void;
  currentQuestion: number;
  totalQuestions: number;
}

export function Quiz({ question, onComplete, onClose, currentQuestion, totalQuestions }: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const isCorrect = selectedAnswer === question.correctAnswer;

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer("");
    setHasSubmitted(false);
  }, [question]);

  // Create audio elements
  useEffect(() => {
    const correctAudio = new Audio("/correct.mp3");
    const wrongAudio = new Audio("/wrong.mp3");
    
    return () => {
      correctAudio.pause();
      wrongAudio.pause();
    };
  }, []);

  const handleCheck = () => {
    setHasSubmitted(true);
    // Play sound based on answer
    const audio = new Audio(isCorrect ? "/correct.mp3" : "/wrong.mp3");
    audio.play();
  };

  const handleNext = () => {
    onComplete(isCorrect);
    setHasSubmitted(false);
    setSelectedAnswer("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div 
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Counter */}
      <div className="text-sm text-gray-500 mb-4">
        Question {currentQuestion} of {totalQuestions}
      </div>

      {/* Question */}
      <h2 className="text-2xl font-bold mb-8">{question.title}</h2>

      {/* Options */}
      <RadioGroup
        value={selectedAnswer}
        onValueChange={setSelectedAnswer}
        className="space-y-4 mb-8"
      >
        {question.options.map((option) => (
          <div
            key={option}
            className={cn(
              "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all",
              hasSubmitted && option === question.correctAnswer
                ? "border-green-500 bg-green-50"
                : hasSubmitted && option === selectedAnswer && !isCorrect
                ? "border-red-500 bg-red-50"
                : selectedAnswer === option
                ? "border-primary"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <RadioGroupItem value={option} id={option} />
            <Label
              htmlFor={option}
              className="flex-grow cursor-pointer py-2"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        {!hasSubmitted ? (
          <Button
            onClick={handleCheck}
            disabled={!selectedAnswer}
            className="px-8"
          >
            Check
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className={cn(
              "px-8",
              isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
            )}
          >
            {isCorrect ? (
              currentQuestion === totalQuestions ? "Complete" : "Next Question"
            ) : (
              "Try Again"
            )}
          </Button>
        )}
      </div>

      {/* Feedback Message */}
      {hasSubmitted && (
        <div
          className={cn(
            "mt-6 p-4 rounded-lg",
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}
        >
          {isCorrect
            ? "Correct! Well done!"
            : `Incorrect. The correct answer is: ${question.correctAnswer}`}
        </div>
      )}
    </div>
  );
}
