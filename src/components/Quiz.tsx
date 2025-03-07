
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Star, Check, X, SkipForward, ChevronRight } from "lucide-react";

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
  const [showConfetti, setShowConfetti] = useState(false);
  const isCorrect = selectedAnswer === question.correctAnswer;
  const audioContext = useRef<AudioContext | null>(null);
  const progressPercentage = ((currentQuestion) / totalQuestions) * 100;

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer("");
    setHasSubmitted(false);
    setShowConfetti(false);
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
  
  // Function to play correct answer sound
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
  
  // Function to play incorrect answer sound
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
          setShowConfetti(true);
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

  // Confetti effect for correct answers
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg animate-fade-in relative overflow-hidden">
      {/* Confetti animation for correct answers */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                animation: `fall-${i % 5} 3s ease-out forwards`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Game-like UI */}
      <div className="bg-purple-100 -m-6 mb-6 p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            {currentQuestion}
          </div>
          <span className="text-purple-800 font-semibold">of {totalQuestions}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-800 font-medium">Level Progress</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar - Shows correct question progress */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500 relative"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-bold mb-8 text-purple-900">{question.title}</h2>

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
              "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all hover:shadow-md",
              hasSubmitted && option === question.correctAnswer
                ? "border-green-500 bg-green-50"
                : hasSubmitted && option === selectedAnswer && !isCorrect
                ? "border-red-500 bg-red-50"
                : selectedAnswer === option
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            )}
          >
            <RadioGroupItem value={option} id={option} />
            <Label
              htmlFor={option}
              className="flex-grow cursor-pointer py-2 font-medium"
            >
              {option}
            </Label>
            {hasSubmitted && option === question.correctAnswer && (
              <Check className="w-5 h-5 text-green-500" />
            )}
            {hasSubmitted && option === selectedAnswer && !isCorrect && (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
        ))}
      </RadioGroup>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        {!hasSubmitted ? (
          <Button
            onClick={handleCheck}
            disabled={!selectedAnswer}
            className="px-8 bg-purple-600 hover:bg-purple-700 transition-colors font-medium gap-2"
          >
            Check Answer <Check className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className={cn(
              "px-8 font-medium gap-2 transition-colors",
              isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
            )}
          >
            {isCorrect ? (
              currentQuestion === totalQuestions ? (
                <>Complete Level <Star className="w-4 h-4" /></>
              ) : (
                <>Next Question <ChevronRight className="w-4 h-4" /></>
              )
            ) : (
              <>Try Again <SkipForward className="w-4 h-4" /></>
            )}
          </Button>
        )}
      </div>

      {/* Feedback Message */}
      {hasSubmitted && (
        <div
          className={cn(
            "mt-6 p-4 rounded-lg font-medium",
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}
        >
          {isCorrect
            ? "🎉 Correct! Well done on completing this challenge!"
            : `❌ Incorrect. The correct answer is: ${question.correctAnswer}`}
        </div>
      )}
    </div>
  );
}
