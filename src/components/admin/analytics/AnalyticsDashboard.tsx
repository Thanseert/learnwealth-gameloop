
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AnalyticsCard from "./AnalyticsCard";
import AnalyticsTrend from "./AnalyticsTrend";
import { Users, TrendingUp, BarChart, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Function to fetch analytics data from Supabase
const fetchAnalyticsData = async () => {
  try {
    // For active users and visitor data, in a real app we would have properly 
    // tracked this data. For now, we'll create mock data based on profiles.
    const { data: profilesData, error } = await supabase
      .from('profiles')
      .select('created_at');
    
    if (error) {
      console.error("Error fetching profiles data:", error);
      throw error;
    }
    
    // Get total user count with safety check
    const totalUsers = profilesData?.length || 0;
    
    // Generate date strings for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    
    // Create user signup data for each day with null checks
    const signupData = last7Days.map(date => {
      // Make sure profilesData exists before filtering
      const count = profilesData ? profilesData.filter(user => 
        user?.created_at && user.created_at.startsWith(date)
      ).length : 0;
      
      return { 
        date: date.slice(5), // Format as MM-DD
        value: count 
      };
    });

    // Mock daily active users data
    const activeUserData = last7Days.map(date => ({
      date: date.slice(5),
      value: Math.floor(Math.random() * (totalUsers * 0.7)) + Math.floor(totalUsers * 0.2)
    }));

    // Mock visitor data - generally higher than user count
    const visitorData = last7Days.map(date => ({
      date: date.slice(5),
      value: Math.floor(Math.random() * 50) + totalUsers + 20
    }));

    // Mock bounce rate data (percentage between 20% and 60%)
    const bounceRateData = last7Days.map(date => ({
      date: date.slice(5),
      value: Math.floor(Math.random() * 40) + 20
    }));
    
    // Calculate totals and averages with comprehensive safety checks
    const totalActiveUsers = Array.isArray(activeUserData) 
      ? activeUserData.reduce((sum, item) => sum + (item?.value || 0), 0) 
      : 0;
      
    const totalVisitors = Array.isArray(visitorData) 
      ? visitorData.reduce((sum, item) => sum + (item?.value || 0), 0)
      : 0;
      
    const avgBounceRate = Array.isArray(bounceRateData) && bounceRateData.length > 0
      ? Math.floor(bounceRateData.reduce((sum, item) => sum + (item?.value || 0), 0) / bounceRateData.length)
      : 0;
      
    const conversionRate = totalVisitors > 0 
      ? Math.floor((totalActiveUsers / totalVisitors) * 100) 
      : 0;
    
    return {
      userCount: totalUsers,
      dailyActiveUsers: Math.floor(totalActiveUsers / 7),
      totalVisitors: Math.floor(totalVisitors / 7),
      bounceRate: avgBounceRate,
      conversionRate,
      signupTrend: signupData || [],
      activeUserTrend: activeUserData || [],
      visitorTrend: visitorData || [],
      bounceRateTrend: bounceRateData || []
    };
  } catch (error) {
    console.error("Error in fetchAnalyticsData:", error);
    // Return default values to prevent undefined errors
    return {
      userCount: 0,
      dailyActiveUsers: 0,
      totalVisitors: 0,
      bounceRate: 0,
      conversionRate: 0,
      signupTrend: [],
      activeUserTrend: [],
      visitorTrend: [],
      bounceRateTrend: []
    };
  }
};

const AnalyticsDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAnalyticsData
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 border border-red-100 rounded-md">
        <h3 className="font-bold mb-2">Error loading analytics data</h3>
        <p>{error.message || "Please try again later."}</p>
      </div>
    );
  }

  // Use default empty values to prevent null/undefined errors
  // Make sure we're guarding against completely undefined data
  const safeData = {
    userCount: data?.userCount || 0,
    dailyActiveUsers: data?.dailyActiveUsers || 0,
    bounceRate: data?.bounceRate || 0,
    conversionRate: data?.conversionRate || 0,
    signupTrend: data?.signupTrend || [],
    activeUserTrend: data?.activeUserTrend || [],
    visitorTrend: data?.visitorTrend || [],
    bounceRateTrend: data?.bounceRateTrend || []
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard 
          title="Total Users" 
          value={safeData.userCount} 
          description="Total registered users"
          icon={<Users className="h-4 w-4" />}
        />
        <AnalyticsCard 
          title="Daily Active Users" 
          value={safeData.dailyActiveUsers} 
          description="Avg. users per day"
          icon={<UserPlus className="h-4 w-4" />}
        />
        <AnalyticsCard 
          title="Bounce Rate" 
          value={`${safeData.bounceRate}%`} 
          description="Avg. exit rate"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <AnalyticsCard 
          title="Conversion Rate" 
          value={`${safeData.conversionRate}%`} 
          description="Visitors to users"
          icon={<BarChart className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsTrend
          title="User Signups" 
          data={safeData.signupTrend}
          color="#4ade80"
          icon={<Users className="h-4 w-4" />}
        />
        <AnalyticsTrend
          title="Daily Active Users" 
          data={safeData.activeUserTrend}
          color="#3b82f6"
          icon={<UserPlus className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsTrend
          title="Visitors" 
          data={safeData.visitorTrend}
          color="#f97316"
          icon={<Users className="h-4 w-4" />}
        />
        <AnalyticsTrend
          title="Bounce Rate" 
          data={safeData.bounceRateTrend}
          color="#ef4444"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
