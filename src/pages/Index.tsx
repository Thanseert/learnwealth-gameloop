
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type FloatingIcon = {
  id: number;
  iconType: string;
  left: number;
  delay: number;
};

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    const icons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      iconType: ["dollar", "trend", "money", "chart", "diamond", "coin", "analytics"][
        Math.floor(Math.random() * 7)
      ],
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFloatingIcons(icons);

    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setUserData(profile);
          localStorage.setItem("userData", JSON.stringify(profile));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Error fetching user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem("userData");
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const handleGetStarted = () => {
    console.log("Get started button clicked");
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-black text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (userData) {
    return (
      <div className="min-h-screen bg-white text-black overflow-hidden relative">
        <nav className="w-full flex justify-between items-center p-4 md:p-6">
          <div className="text-xl md:text-2xl font-bold text-green-600">Finzow</div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
            size={isMobile ? "sm" : "default"}
          >
            <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Log out
          </Button>
        </nav>

        <div className="container mx-auto px-4 py-6 md:py-10 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl text-center space-y-4 md:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent animate-fade-in">
              Learn
              <br className="block" />
              <span className="block mt-2 md:mt-6 mb-4 md:mb-8 leading-tight">by playing</span>
            </h1>
            
            <div className="space-y-2 mt-12 md:mt-24 mb-6 md:mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700">
                Finzow is where the next generation learns finance - by playing.
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700">
                Get smarter in 5 minutes a day.
              </p>
            </div>
            
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button
                onClick={() => navigate('/lessons')}
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-4 md:px-12 md:py-8 text-base md:text-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center cursor-pointer z-10"
              >
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Go to Lessons
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 bg-gradient-to-t from-green-50 to-transparent opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden relative">
      <nav className="w-full flex justify-between items-center p-4 md:p-6">
        <div className="text-xl md:text-2xl font-bold text-green-600">Finzow</div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/auth')} 
          className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer z-10 text-xs md:text-sm"
          size={isMobile ? "sm" : "default"}
        >
          Log in
        </Button>
      </nav>

      <div className="container mx-auto px-4 py-6 md:py-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl text-center space-y-4 md:space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent animate-fade-in">
            Learn
            <br className="block" />
            <span className="block mt-2 md:mt-6 mb-4 md:mb-8 leading-tight">by playing</span>
          </h1>
          
          <div className="space-y-2 mt-12 md:mt-24 mb-6 md:mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700">
              Finzow is where the next generation learns finance - by playing.
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700">
              Get smarter in 5 minutes a day.
            </p>
          </div>
          
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button
              onClick={() => navigate('/auth')}
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-4 md:px-12 md:py-8 text-base md:text-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center cursor-pointer z-10"
            >
              <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Get started
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 bg-gradient-to-t from-green-50 to-transparent opacity-50"></div>
    </div>
  );
};

export default Index;
