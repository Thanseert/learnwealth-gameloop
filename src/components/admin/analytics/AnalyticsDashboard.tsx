
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AnalyticsCard from "./AnalyticsCard";
import AnalyticsTrend from "./AnalyticsTrend";
import { Users, TrendingUp, BarChart, UserPlus } from "lucide-react";

// Function to fetch analytics data from Supabase
const fetchAnalyticsData = async () => {
  // For active users and visitor data, in a real app we would have properly 
  // tracked this data. For now, we'll create mock data based on profiles.
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('created_at');
  
  // Get total user count  
  const totalUsers = profilesData?.length || 0;
  
  // Generate date strings for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  // Create user signup data for each day
  const signupData = last7Days.map(date => {
    const count = profilesData?.filter(user => 
      user.created_at && user.created_at.startsWith(date)
    ).length || 0;
    
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
  
  // Calculate totals and averages
  const totalActiveUsers = activeUserData.reduce((sum, item) => sum + item.value, 0);
  const totalVisitors = visitorData.reduce((sum, item) => sum + item.value, 0);
  const avgBounceRate = Math.floor(
    bounceRateData.reduce((sum, item) => sum + item.value, 0) / bounceRateData.length
  );
  const conversionRate = Math.floor((totalActiveUsers / totalVisitors) * 100);
  
  return {
    userCount: totalUsers,
    dailyActiveUsers: Math.floor(totalActiveUsers / 7),
    totalVisitors: Math.floor(totalVisitors / 7),
    bounceRate: avgBounceRate,
    conversionRate,
    signupTrend: signupData,
    activeUserTrend: activeUserData,
    visitorTrend: visitorData,
    bounceRateTrend: bounceRateData
  };
};

const AnalyticsDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAnalyticsData
  });

  if (isLoading) {
    return (
      <div className="p-4 animate-pulse flex flex-col gap-4">
        <div className="h-20 bg-gray-200 rounded-md"></div>
        <div className="h-64 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading analytics data. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard 
          title="Total Users" 
          value={data?.userCount || 0} 
          description="Total registered users"
          icon={<Users className="h-4 w-4" />}
        />
        <AnalyticsCard 
          title="Daily Active Users" 
          value={data?.dailyActiveUsers || 0} 
          description="Avg. users per day"
          icon={<UserPlus className="h-4 w-4" />}
        />
        <AnalyticsCard 
          title="Bounce Rate" 
          value={`${data?.bounceRate || 0}%`} 
          description="Avg. exit rate"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <AnalyticsCard 
          title="Conversion Rate" 
          value={`${data?.conversionRate || 0}%`} 
          description="Visitors to users"
          icon={<BarChart className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsTrend
          title="User Signups" 
          data={data?.signupTrend || []}
          color="#4ade80"
          icon={<Users className="h-4 w-4" />}
        />
        <AnalyticsTrend
          title="Daily Active Users" 
          data={data?.activeUserTrend || []}
          color="#3b82f6"
          icon={<UserPlus className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsTrend
          title="Visitors" 
          data={data?.visitorTrend || []}
          color="#f97316"
          icon={<Users className="h-4 w-4" />}
        />
        <AnalyticsTrend
          title="Bounce Rate" 
          data={data?.bounceRateTrend || []}
          color="#ef4444"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
