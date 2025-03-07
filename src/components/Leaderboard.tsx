
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Crown, Star, Coins, Award } from "lucide-react";
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
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
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
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
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
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <Star className="h-5 w-5 text-purple-500" />;
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

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 50) + 1;
  };

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="h-6 w-6" />
          Champions Leaderboard
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
                className={`flex items-center justify-between p-4 ${getBackgroundClass(user.rank)} border-l-4 transition-all hover:translate-x-1`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    user.rank <= 3 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : 'bg-gray-100'
                  } shadow-md`}>
                    {getRankIcon(user.rank)}
                  </div>
                  <div>
                    <div className="font-bold">{user.username || 'Anonymous'}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      Level {calculateLevel(user.xp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="font-bold text-yellow-800">{user.xp || 0}</span>
                  <span className="text-xs text-yellow-600">XP</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
