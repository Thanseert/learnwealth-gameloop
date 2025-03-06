
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: number;
  title: string;
  options: string[];
  correct_answer: string;
  lesson_id: number;
}

interface Lesson {
  id: number;
  title: string;
}

interface QuestionFormProps {
  lessons: Lesson[];
  editingQuestion: Question | null;
  setEditingQuestion: (question: Question | null) => void;
  onQuestionUpdated: () => void;
}

const QuestionForm = ({ 
  lessons, 
  editingQuestion, 
  setEditingQuestion, 
  onQuestionUpdated 
}: QuestionFormProps) => {
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    options: ["", "", "", ""],
    correct_answer: "",
    lesson_id: 0
  });

  const handleOptionChange = (index: number, value: string, isEditing: boolean) => {
    if (isEditing && editingQuestion) {
      const newOptions = [...editingQuestion.options];
      newOptions[index] = value;
      setEditingQuestion({ ...editingQuestion, options: newOptions });
    } else {
      const newOptions = [...newQuestion.options];
      newOptions[index] = value;
      setNewQuestion({ ...newQuestion, options: newOptions });
    }
  };

  const handleAddQuestion = async () => {
    try {
      if (!newQuestion.title || newQuestion.options.some(opt => !opt) || !newQuestion.correct_answer || !newQuestion.lesson_id) {
        toast.error('Please fill in all fields');
        return;
      }

      const { data, error } = await supabase
        .from('questions')
        .insert([
          {
            title: newQuestion.title,
            options: newQuestion.options,
            correct_answer: newQuestion.correct_answer,
            lesson_id: newQuestion.lesson_id
          }
        ]);

      if (error) throw error;
      
      toast.success('Question added successfully');
      setNewQuestion({
        title: "",
        options: ["", "", "", ""],
        correct_answer: "",
        lesson_id: 0
      });
      onQuestionUpdated();
    } catch (err) {
      console.error('Error adding question:', err);
      toast.error('Error adding question');
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      if (!editingQuestion) return;
      
      if (!editingQuestion.title || editingQuestion.options.some(opt => !opt) || !editingQuestion.correct_answer || !editingQuestion.lesson_id) {
        toast.error('Please fill in all fields');
        return;
      }

      const { data, error } = await supabase
        .from('questions')
        .update({
          title: editingQuestion.title,
          options: editingQuestion.options,
          correct_answer: editingQuestion.correct_answer,
          lesson_id: editingQuestion.lesson_id
        })
        .eq('id', editingQuestion.id);

      if (error) throw error;
      
      toast.success('Question updated successfully');
      setEditingQuestion(null);
      onQuestionUpdated();
    } catch (err) {
      console.error('Error updating question:', err);
      toast.error('Error updating question');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingQuestion ? "Edit Question" : "Add New Question"}
      </h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="lesson">Lesson</Label>
          <select 
            id="lesson"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={editingQuestion ? editingQuestion.lesson_id : newQuestion.lesson_id}
            onChange={(e) => {
              if (editingQuestion) {
                setEditingQuestion({ ...editingQuestion, lesson_id: parseInt(e.target.value) });
              } else {
                setNewQuestion({ ...newQuestion, lesson_id: parseInt(e.target.value) });
              }
            }}
          >
            <option value={0}>Select a lesson</option>
            {lessons.map((lesson: Lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <Label htmlFor="title">Question Title</Label>
          <Input
            id="title"
            value={editingQuestion ? editingQuestion.title : newQuestion.title}
            onChange={(e) => {
              if (editingQuestion) {
                setEditingQuestion({ ...editingQuestion, title: e.target.value });
              } else {
                setNewQuestion({ ...newQuestion, title: e.target.value });
              }
            }}
            placeholder="Enter question title"
          />
        </div>
        
        <div>
          <Label>Options</Label>
          <div className="space-y-2">
            {(editingQuestion ? editingQuestion.options : newQuestion.options).map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value, !!editingQuestion)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    if (editingQuestion) {
                      setEditingQuestion({ ...editingQuestion, correct_answer: option });
                    } else {
                      setNewQuestion({ ...newQuestion, correct_answer: option });
                    }
                  }}
                  className={`${(editingQuestion ? editingQuestion.correct_answer : newQuestion.correct_answer) === option ? 'bg-green-100 border-green-300' : ''}`}
                >
                  Correct
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          {editingQuestion ? (
            <>
              <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateQuestion}>
                Update Question
              </Button>
            </>
          ) : (
            <Button onClick={handleAddQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
