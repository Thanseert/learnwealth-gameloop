
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
import LevelForm from "@/components/admin/LevelForm";
import LevelList from "@/components/admin/LevelList";
import AnalyticsDashboard from "@/components/admin/analytics/AnalyticsDashboard";

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
    .select('id, title, description, difficulty, order, xp')
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
  // Simply track if admin password has been entered
  const [isAdmin, setIsAdmin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'questions' | 'levels'>('analytics');
  
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

        {/* Tab navigation */}
        <div className="flex space-x-2 border-b pb-2">
          <Button 
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics Dashboard
          </Button>
          <Button 
            variant={activeTab === 'questions' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('questions')}
          >
            Manage Questions
          </Button>
          <Button 
            variant={activeTab === 'levels' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('levels')}
          >
            Manage Levels
          </Button>
        </div>

        {/* Tab content */}
        <div className="space-y-8">
          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}

          {activeTab === 'questions' && (
            <>
              <QuestionForm
                lessons={lessons}
                editingQuestion={editingQuestion}
                setEditingQuestion={setEditingQuestion}
                onQuestionUpdated={refetch}
              />

              <QuestionList
                questions={questions}
                lessons={lessons}
                onQuestionDeleted={refetch}
                onEditQuestion={setEditingQuestion}
              />
            </>
          )}

          {activeTab === 'levels' && (
            <>
              <LevelForm onLevelAdded={refetch} />
              
              <LevelList lessons={lessons} onLevelDeleted={refetch} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
