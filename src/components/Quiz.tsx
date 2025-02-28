
import { useState, useEffect, useRef } from "react";
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
  const audioContext = useRef<AudioContext | null>(null);

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer("");
    setHasSubmitted(false);
  }, [question]);

  // Initialize audio context
  useEffect(() => {
    // Create audio context on component mount
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      // Clean up audio context when component unmounts
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);
  
  // Function to play correct answer sound
  const playCorrectSound = () => {
    if (!audioContext.current) return;
    
    const context = audioContext.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Connect oscillator to gain node
    oscillator.connect(gainNode);
    // Connect gain node to audio output
    gainNode.connect(context.destination);
    
    // Set oscillator properties for correct sound (happy sound)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2); // G5
    
    // Set gain (volume)
    gainNode.gain.setValueAtTime(0.5, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    // Start and stop the sound
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
  };
  
  // Function to play incorrect answer sound
  const playIncorrectSound = () => {
    if (!audioContext.current) return;
    
    const context = audioContext.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Connect oscillator to gain node
    oscillator.connect(gainNode);
    // Connect gain node to audio output
    gainNode.connect(context.destination);
    
    // Set oscillator properties for incorrect sound (sad sound)
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, context.currentTime); // A4
    oscillator.frequency.setValueAtTime(349.23, context.currentTime + 0.1); // F4
    
    // Set gain (volume)
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
    
    // Start and stop the sound
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.2);
  };

  const handleCheck = () => {
    setHasSubmitted(true);
    
    // Resume audio context if it was suspended (browsers require user interaction)
    if (audioContext.current && audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    
    // Play appropriate sound based on answer
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
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
