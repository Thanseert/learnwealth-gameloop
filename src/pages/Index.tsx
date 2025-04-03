
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Rocket } from "lucide-react";
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

  // Render welcome page for authenticated users
  if (userData) {
    return (
      <div className="min-h-screen bg-white text-black overflow-hidden relative">
        {/* Navigation section with logo and logout */}
        <nav className="w-full flex justify-between items-center p-6">
          <div className="text-2xl font-bold text-green-600">Finzow</div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </nav>

        {/* Main content */}
        <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl text-center space-y-8">
            {/* Large heading with gradient text - ADJUSTED FOR VISIBILITY */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent animate-fade-in">
              Learn
              <br className="block" />
              <span className="block mt-6 mb-8 leading-tight">by playing</span>
            </h1>
            
            {/* Subheadings - with proper margin to avoid overlap */}
            <div className="space-y-2 mt-24 mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <p className="text-xl md:text-2xl text-gray-700">
                Interactive financial problem solving that's effective and fun.
              </p>
              <p className="text-xl md:text-2xl text-gray-700">
                Get smarter in 15 minutes a day.
              </p>
            </div>
            
            {/* Primary CTA button with enhanced styling and centered position */}
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button
                onClick={() => navigate('/lessons')}
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-12 py-8 text-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center cursor-pointer z-10"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Go to Lessons
              </Button>
            </div>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-green-50 to-transparent opacity-50"></div>
      </div>
    );
  }

  // Render homepage for non-authenticated users
  return (
    <div className="min-h-screen bg-white text-black overflow-hidden relative">
      {/* Navigation section with logo and login */}
      <nav className="w-full flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-green-600">Finzow</div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/auth')} 
          className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer z-10"
        >
          Log in
        </Button>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl text-center space-y-8">
          {/* Large heading with gradient text - ADJUSTED FOR VISIBILITY */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent animate-fade-in">
            Learn
            <br className="block" />
            <span className="block mt-6 mb-8 leading-tight">by playing</span>
          </h1>
          
          {/* Subheadings - with proper margin to avoid overlap */}
          <div className="space-y-2 mt-24 mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-xl md:text-2xl text-gray-700">
              Interactive financial problem solving that's effective and fun.
            </p>
            <p className="text-xl md:text-2xl text-gray-700">
              Get smarter in 15 minutes a day.
            </p>
          </div>
          
          {/* Primary CTA button with enhanced styling and centered position */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button
              onClick={handleGetStarted}
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-12 py-8 text-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center cursor-pointer z-10"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Get started
            </Button>
          </div>
        </div>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-green-50 to-transparent opacity-50"></div>
    </div>
  );
};

export default Index;
