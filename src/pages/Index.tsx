
import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserData(profile);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/auth');
    }
  };

  if (userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-6xl mx-auto px-4 py-20">
          <div className="flex justify-end mb-8">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Welcome back, <span className="text-primary">{userData.username}</span>!
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto">
              Continue your financial education journey
            </p>
            <a
              href="/lessons"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
            >
              Continue Learning
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Master Your <span className="text-primary">Financial Future</span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto">
            Learn essential financial skills through interactive lessons and quizzes.
            Start your journey to financial literacy today.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="px-8 py-6 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
