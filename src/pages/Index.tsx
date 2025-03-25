
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
          <div className="text-2xl font-bold">Finzow</div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            Log out
          </Button>
        </nav>

        {/* Main content */}
        <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl text-center space-y-5">
            {/* Large heading similar to the reference */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              Learn<br/>by doing
            </h1>
            
            {/* Subheadings */}
            <div className="space-y-2 mt-6 mb-12">
              <p className="text-xl md:text-2xl text-gray-800">
                Interactive financial problem solving that's effective and fun.
              </p>
              <p className="text-xl md:text-2xl text-gray-800">
                Get smarter in 15 minutes a day.
              </p>
            </div>
            
            {/* Primary CTA button */}
            <Button
              onClick={() => navigate("/lessons")}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-12 py-6 text-xl font-medium transition-all shadow-md"
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render homepage for non-authenticated users
  return (
    <div className="min-h-screen bg-white text-black overflow-hidden relative">
      {/* Navigation section with logo and login */}
      <nav className="w-full flex justify-between items-center p-6">
        <div className="text-2xl font-bold">Finzow</div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/auth')} 
          className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-100"
        >
          Log in
        </Button>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl text-center space-y-5">
          {/* Large heading similar to the reference */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            Learn<br/>by doing
          </h1>
          
          {/* Subheadings */}
          <div className="space-y-2 mt-6 mb-12">
            <p className="text-xl md:text-2xl text-gray-800">
              Interactive financial problem solving that's effective and fun.
            </p>
            <p className="text-xl md:text-2xl text-gray-800">
              Get smarter in 15 minutes a day.
            </p>
          </div>
          
          {/* Primary CTA button */}
          <Button
            onClick={() => navigate("/auth")}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-12 py-6 text-xl font-medium transition-all shadow-md"
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
