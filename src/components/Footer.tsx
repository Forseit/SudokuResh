import React from 'react';
import { Users, Play, RefreshCw, Calendar, Navigation, MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

type GlobalStats = Database['public']['Tables']['global_stats']['Row'];

const defaultStats: GlobalStats = {
  id: 1,
  user_count: 0,
  games_solved: 0,
  updates_count: 11,
  start_date: '2024-02-01'
};

const Footer = ({ t }: { t: any }) => {
  const queryClient = useQueryClient();

  const { data: stats = defaultStats } = useQuery({
    queryKey: ['global-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_stats')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching stats:', error);
        return defaultStats;
      }

      return data || defaultStats;
    },
    initialData: defaultStats
  });

  // Check if this is a new user
  React.useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
      incrementUserCount();
    }
  }, []);

  const incrementUserCount = async () => {
    const { error } = await supabase.rpc('increment_user_count');
    if (error) console.error('Error incrementing user count:', error);
  };

  // Subscribe to game count updates
  React.useEffect(() => {
    const channel = supabase
      .channel('game_count_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'global_stats',
          filter: 'id=eq.1'
        },
        (payload) => {
          // Update the cache when we receive real-time updates
          queryClient.setQueryData(['global-stats'], payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const calculateDaysFromStart = () => {
    const startDate = new Date(stats.start_date || '2024-02-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <footer className="mt-auto">
      <div className="bg-background border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-8">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{stats.user_count}</div>
                <div className="text-sm text-muted-foreground">{t.users}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Play className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{stats.games_solved}</div>
                <div className="text-sm text-muted-foreground">{t.gamesSolved}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{stats.updates_count}</div>
                <div className="text-sm text-muted-foreground">{t.updatesReleased}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{calculateDaysFromStart()}</div>
                <div className="text-sm text-muted-foreground">{t.daysFromStart}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted py-6">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">SudokuResh</h2>
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              <span className="font-medium text-foreground">Навигация</span>
            </div>
            <Link to="/reviews" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span>Отзывы</span>
            </Link>
          </div>
          <p className="text-muted-foreground mb-4">
            {t.contactEmail}: dkorostelev1308@gmail.com
          </p>
          <p className="text-sm text-muted-foreground">
            Copyright © SudokuResh 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
