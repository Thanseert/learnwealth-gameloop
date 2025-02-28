
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface LeaderboardUser {
  id: string;
  username: string;
  xp: number;
  rank: number;
}

const fetchLeaderboardData = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, xp')
    .order('xp', { ascending: false })
    .limit(10);
  
  if (error) throw error;
  
  // Add rank to each user
  const usersWithRank = data.map((user, index) => ({
    ...user,
    rank: index + 1
  }));
  
  return usersWithRank;
};

export const Leaderboard = () => {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboardData,
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <div className="animate-pulse">Loading leaderboard data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 p-4">
            Error loading leaderboard data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <Star className="h-5 w-5 text-primary" />;
    }
  };

  const getBackgroundClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-yellow-500";
      case 2:
        return "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-700";
      default:
        return "bg-white border-gray-200 hover:bg-gray-50";
    }
  };

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/80 to-primary text-white">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="h-6 w-6" />
          XP Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No data available yet. Start earning XP!
            </div>
          ) : (
            users.map((user: LeaderboardUser) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 ${getBackgroundClass(user.rank)} border-l-4 transition-all`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="font-medium">{user.username || 'Anonymous'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{user.xp || 0}</span>
                  <span className="text-xs text-gray-500">XP</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
