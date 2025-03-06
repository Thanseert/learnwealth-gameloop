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
    
    // Ensure audio context is started (needed for some browsers)
    if (audioContext.current && audioContext.current.state === 'suspended') {
      const resumeAudio = () => {
        if (audioContext.current && audioContext.current.state === 'suspended') {
          audioContext.current.resume();
        }
        document.removeEventListener('click', resumeAudio);
      };
      document.addEventListener('click', resumeAudio);
    }
    
    return () => {
      // Clean up audio context when component unmounts
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);
  
  // Function to play correct answer sound - now consistent for all correct answers
  const playCorrectSound = () => {
    if (!audioContext.current) return;
    
    const context = audioContext.current;
    
    // Force resume the audio context
    if (context.state === 'suspended') {
      context.resume();
    }
    
    // Create main oscillator
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Set consistent properties for correct sound (happy sound)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(587.33, context.currentTime); // D5
    oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.1); // G5
    
    // Set gain to maximum
    gainNode.gain.setValueAtTime(1.0, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
    
    // Add second oscillator for fuller sound
    const oscillator2 = context.createOscillator();
    const gainNode2 = context.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(context.destination);
    
    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(392.00, context.currentTime); // G4
    
    gainNode2.gain.setValueAtTime(1.0, context.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    oscillator2.start(context.currentTime);
    oscillator2.stop(context.currentTime + 0.3);
  };
  
  // Function to play incorrect answer sound - now consistent for all incorrect answers
  const playIncorrectSound = () => {
    if (!audioContext.current) return;
    
    const context = audioContext.current;
    
    // Force resume the audio context
    if (context.state === 'suspended') {
      context.resume();
    }
    
    // Create main oscillator
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Set consistent properties for incorrect sound (sad sound)
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(220, context.currentTime); // A3
    
    // Set gain to maximum
    gainNode.gain.setValueAtTime(1.0, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
    
    // Add a second oscillator for a stronger wrong answer sound
    const oscillator2 = context.createOscillator();
    const gainNode2 = context.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(context.destination);
    
    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(196.00, context.currentTime); // G3
    
    gainNode2.gain.setValueAtTime(1.0, context.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    oscillator2.start(context.currentTime);
    oscillator2.stop(context.currentTime + 0.3);
  };

  const handleCheck = () => {
    setHasSubmitted(true);
    
    // Force resume audio context if it was suspended
    if (audioContext.current) {
      audioContext.current.resume().then(() => {
        // Play appropriate sound based on answer
        if (isCorrect) {
          playCorrectSound();
        } else {
          playIncorrectSound();
        }
      }).catch(err => {
        console.error("Failed to resume audio context:", err);
      });
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
