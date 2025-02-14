
import { useState } from "react";
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
}

export function Quiz({ question, onComplete, onClose }: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleCheck = () => {
    setHasSubmitted(true);
    onComplete(isCorrect);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div className="h-full bg-green-500 rounded-full w-1/3" />
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
        <Button
          variant="outline"
          onClick={onClose}
        >
          Skip
        </Button>
        <Button
          onClick={handleCheck}
          disabled={!selectedAnswer || hasSubmitted}
          className="px-8"
        >
          Check
        </Button>
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
