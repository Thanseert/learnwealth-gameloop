
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

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

const fetchLessonsAndQuestions = async () => {
  // Fetch lessons
  const { data: lessonsData, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title')
    .order('order');

  if (lessonsError) throw lessonsError;

  // Fetch questions
  const { data: questionsData, error: questionsError } = await supabase
    .from('questions')
    .select('*');

  if (questionsError) throw questionsError;

  return { lessons: lessonsData, questions: questionsData };
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    options: ["", "", "", ""],
    correct_answer: "",
    lesson_id: 0
  });
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-data'],
    queryFn: fetchLessonsAndQuestions
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to access admin panel');
        navigate('/auth');
        return;
      }
      
      // In a real app, you'd check if the user has admin permissions
      // For now, we'll just set everyone as admin for demo purposes
      setIsAdmin(true);
    };

    checkAuth();
  }, [navigate]);

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
      refetch();
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
      refetch();
    } catch (err) {
      console.error('Error updating question:', err);
      toast.error('Error updating question');
    }
  };

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
      refetch();
    } catch (err) {
      console.error('Error deleting question:', err);
      toast.error('Error deleting question');
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading admin panel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading data. Please try again later.</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">You don't have permission to access this page.</div>
      </div>
    );
  }

  const lessons = data?.lessons || [];
  const questions = data?.questions || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
        </div>

        {/* Add Question Form */}
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
                        const value = editingQuestion ? editingQuestion.correct_answer : newQuestion.correct_answer;
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

        {/* Questions List */}
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
                      <div>
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
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingQuestion(question)}>
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
      </div>
    </div>
  );
};

export default Admin;
