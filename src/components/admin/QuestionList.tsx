
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: number;
  title: string;
  options: string[];
  correct_answer: string;
  lesson_id: number;
  explanation?: string;
}

interface Lesson {
  id: number;
  title: string;
}

interface QuestionListProps {
  questions: Question[];
  lessons: Lesson[];
  onQuestionDeleted: () => void;
  onEditQuestion: (question: Question) => void;
}

const QuestionList = ({ questions, lessons, onQuestionDeleted, onEditQuestion }: QuestionListProps) => {
  const handleDeleteQuestion = async (id: number) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this question?');
      if (!confirmed) return;
      
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Question deleted successfully');
      onQuestionDeleted();
    } catch (err) {
      console.error('Error deleting question:', err);
      toast.error('Error deleting question');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Manage Questions</h2>
      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions found.</p>
        ) : (
          questions.map((question: Question) => {
            const lesson = lessons.find((l: Lesson) => l.id === question.lesson_id);
            return (
              <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div className="w-full">
                    <span className="text-xs text-gray-500">Lesson: {lesson?.title || 'Unknown'}</span>
                    <h3 className="font-medium">{question.title}</h3>
                    <div className="mt-2 space-y-1">
                      {question.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className={`text-sm ${option === question.correct_answer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                            {option === question.correct_answer && '✓ '}
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-2 flex items-center gap-1 text-blue-600">
                        <Lightbulb className="h-4 w-4" />
                        <span className="text-sm italic">Has explanation</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEditQuestion(question)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(question.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuestionList;
