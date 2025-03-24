
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Rocket, TrendingUp, DollarSign, Gamepad, Award } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Define the correct type for floating icons
type FloatingIcon = {
  id: number;
  iconType: string;
  left: number;
  delay: number;
};

const Index = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    // Create floating finance icons for the background with proper typing
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

  // Helper function to render icons based on type
  const renderIcon = (type: string, key: number) => {
    switch(type) {
      case "dollar": return <DollarSign key={key} className="h-6 w-6" />;
      case "trend": return <TrendingUp key={key} className="h-6 w-6" />;
      case "money": return <span key={key}>💰</span>;
      case "chart": return <span key={key}>📈</span>;
      case "diamond": return <span key={key}>💎</span>;
      case "coin": return <span key={key}>🪙</span>;
      case "analytics": return <span key={key}>📊</span>;
      default: return <DollarSign key={key} className="h-6 w-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d101e] to-[#162553]">
        <div className="animate-pulse text-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  // Render game-like welcome page for authenticated users
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
              {renderIcon(item.iconType, item.id)}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex justify-end mb-8">
            <Button variant="outline" onClick={handleLogout} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-12 mt-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-300 mb-2">Welcome back,</h2>
              <h1 className="text-4xl font-extrabold text-white mb-6">{userData.username}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="game-card bg-gradient-to-br from-purple-800/40 to-indigo-900/40 backdrop-blur-md p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all">
                  <div className="rounded-full bg-purple-600/30 w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                    <BookOpen className="text-purple-200 h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Learn</h3>
                  <p className="text-purple-200 text-sm">Explore financial concepts through interactive lessons</p>
                </div>

                <div className="game-card bg-gradient-to-br from-blue-800/40 to-cyan-900/40 backdrop-blur-md p-6 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all">
                  <div className="rounded-full bg-blue-600/30 w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                    <Award className="text-blue-200 h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Achieve</h3>
                  <p className="text-blue-200 text-sm">Complete challenges and earn achievements</p>
                </div>

                <div className="game-card bg-gradient-to-br from-pink-800/40 to-red-900/40 backdrop-blur-md p-6 rounded-xl border border-pink-500/30 hover:border-pink-400/50 transition-all">
                  <div className="rounded-full bg-pink-600/30 w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                    <Gamepad className="text-pink-200 h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Play</h3>
                  <p className="text-pink-200 text-sm">Make learning finance fun with interactive games</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => navigate("/lessons")}
              className="relative px-8 py-6 text-lg font-medium text-white bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 border border-purple-400/20 game-btn"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Continue Your Journey
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render game-like homepage for non-authenticated users
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
            {renderIcon(item.iconType, item.id)}
          </div>
        ))}
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main hero section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
          {/* Game logo area with glow effect */}
          <div className="relative mb-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-indigo-900 to-purple-900 rounded-full p-8">
              <DollarSign className="h-16 w-16 text-purple-200" />
            </div>
          </div>
          
          {/* Title with animated gradient */}
          <h1 className="text-8xl md:text-9xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-yellow-500 animate-pulse">
            FINZOW
          </h1>
          
          {/* Tagline */}
          <p className="text-3xl md:text-4xl text-gray-300 font-light mb-8">
            Your Financial Adventure Awaits
          </p>
          
          {/* Description */}
          <p className="max-w-2xl text-lg text-gray-400 mb-12">
            Level up your money skills through interactive lessons, fun challenges, and real-world financial quests.
          </p>
          
          {/* CTA Button with animated effect */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <Button 
              onClick={() => navigate('/auth')}
              className="relative px-10 py-6 text-xl font-bold text-white bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 uppercase game-btn"
            >
              <Rocket className="mr-2 h-6 w-6" />
              Start Your Adventure
            </Button>
          </div>
        </div>
        
        {/* Feature cards section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="game-card bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Level Up</h3>
              <p className="text-gray-400">Gain XP and unlock achievements as you master financial concepts</p>
            </div>
            
            <div className="game-card bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real Skills</h3>
              <p className="text-gray-400">Learn practical money management skills that apply to your everyday life</p>
            </div>
            
            <div className="game-card bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-4">
                <Gamepad className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fun Challenges</h3>
              <p className="text-gray-400">Compete in quests and challenges that make learning finance engaging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
