
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import QuestionForm from "@/components/admin/QuestionForm";
import QuestionList from "@/components/admin/QuestionList";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-data'],
    queryFn: fetchLessonsAndQuestions,
    enabled: isAuthenticated && isAdmin
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to access admin panel');
        navigate('/auth');
        return;
      }
      
      // Check if the user has an admin email
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email?.includes('admin')) {
        setIsAdmin(true);
      } else {
        toast.error('You do not have admin privileges');
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

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

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLoginForm isAdmin={isAdmin} onAuthenticated={() => setIsAuthenticated(true)} />;
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

        {/* Add/Edit Question Form */}
        <QuestionForm
          lessons={lessons}
          editingQuestion={editingQuestion}
          setEditingQuestion={setEditingQuestion}
          onQuestionUpdated={refetch}
        />

        {/* Questions List */}
        <QuestionList
          questions={questions}
          lessons={lessons}
          onQuestionDeleted={refetch}
          onEditQuestion={setEditingQuestion}
        />
      </div>
    </div>
  );
};

export default Admin;
