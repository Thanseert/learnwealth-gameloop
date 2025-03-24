
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Rocket, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [floatingIcons, setFloatingIcons] = useState<{ id: number; icon: string; left: number; delay: number }[]>([]);

  useEffect(() => {
    // Create floating finance icons for the background
    const icons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      icon: [<DollarSign key={`dollar-${i}`} />, <TrendingUp key={`trend-${i}`} />, "💰", "📈", "💎", "🪙", "📊"][
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
          // Store user data in localStorage
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
      
      // Clear user data from localStorage
      localStorage.removeItem("userData");
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d101e] to-[#162553]">
        <div className="animate-pulse text-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d101e] to-[#162553] overflow-hidden relative">
        {/* Floating finance icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingIcons.map((item) => (
            <div
              key={item.id}
              className="absolute text-white/20 text-3xl"
              style={{
                left: `${item.left}%`,
                top: '-50px',
                animation: `fall-${item.id % 5} ${3 + item.delay}s linear infinite`,
                animationDelay: `${item.delay}s`,
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>

        <div className="container max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="flex justify-end mb-8 gap-4">
            <Button variant="outline" onClick={handleLogout} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8 mt-20">
            <div className="text-center space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-yellow-500 animate-pulse">
                Welcome back, <span className="text-white">{userData.username}!</span>
              </h1>
              <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto">
                Continue your journey to financial mastery
              </p>
            </div>
            
            <div className="mt-12 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <Button
                onClick={() => navigate("/lessons")}
                className="relative px-8 py-6 text-lg font-medium text-white bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d101e] to-[#162553] overflow-hidden relative">
      {/* Animated floating finance icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item) => (
          <div
            key={item.id}
            className="absolute text-white/20 text-3xl"
            style={{
              left: `${item.left}%`,
              top: '-50px',
              animation: `fall-${item.id % 5} ${3 + item.delay}s linear infinite`,
              animationDelay: `${item.delay}s`,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col min-h-[80vh] items-center justify-center">
          <div className="text-center space-y-6 max-w-4xl">
            <div className="mb-8">
              <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-yellow-500">
                FINZOW
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl text-gray-300 font-light">
                Your Financial Playground
              </p>
            </div>
            
            <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto mt-4">
              Master your financial future through fun, interactive lessons and challenges.
              Level up your wealth knowledge and unlock real-world money skills.
            </p>
            
            <div className="mt-16 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <Button 
                onClick={() => navigate('/auth')}
                className="relative px-10 py-8 text-xl font-bold tracking-wider text-white bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 uppercase"
              >
                <Rocket className="mr-2 h-6 w-6" />
                Start Your Adventure
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn & Earn</h3>
              <p className="text-gray-400">Earn rewards as you complete lessons and master financial concepts</p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real Skills</h3>
              <p className="text-gray-400">Gain practical knowledge you can apply to your everyday financial decisions</p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fun Challenges</h3>
              <p className="text-gray-400">Test your knowledge with interactive quizzes and engaging financial challenges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
