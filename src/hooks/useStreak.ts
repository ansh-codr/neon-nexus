import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  UserStreakRecord,
  PublicUserSnapshot,
  CompetitiveFeedItem,
  getOrCreateUserStreak,
  updateHealthStreak,
  updateStudyStreak,
  subscribeToUserStreak,
  subscribeToPublicLeaderboard,
  subscribeToCompetitiveFeed,
  isStreakAtRisk,
  getAggregateStats,
} from '@/firebase/streaks';
import {
  DEMO_STREAK_DATA,
  DEMO_COMPETITIVE_FEED,
  DEMO_PUBLIC_LEADERBOARD,
  DEMO_AGGREGATE_STATS,
} from '@/firebase/demoData';

export interface UseStreakReturn {
  streak: UserStreakRecord | null;
  publicLeaderboard: PublicUserSnapshot[];
  competitiveFeed: CompetitiveFeedItem[];
  loading: boolean;
  isAtRisk: boolean;
  logHealthActivity: () => Promise<void>;
  logStudyActivity: () => Promise<void>;
  refreshStreak: () => Promise<void>;
  aggregateStats: {
    activeUsers: number;
    topStreak: number;
    avgConsistency: number;
  } | null;
}

// Default streak for new users (using any for demo compatibility)
const DEFAULT_STREAK = {
  ...DEMO_STREAK_DATA,
  createdAt: new Date(),
  updatedAt: new Date(),
} as any;

export const useStreak = (): UseStreakReturn => {
  const { user, userProfile } = useAuth();
  const [streak, setStreak] = useState<UserStreakRecord | null>(null);
  const [publicLeaderboard, setPublicLeaderboard] = useState<PublicUserSnapshot[]>(DEMO_PUBLIC_LEADERBOARD);
  const [competitiveFeed, setCompetitiveFeed] = useState<CompetitiveFeedItem[]>(DEMO_COMPETITIVE_FEED as any);
  const [loading, setLoading] = useState(true);
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [aggregateStats, setAggregateStats] = useState<{
    activeUsers: number;
    topStreak: number;
    avgConsistency: number;
  } | null>(DEMO_AGGREGATE_STATS);

  // Initialize streak data
  useEffect(() => {
    if (!user) {
      // Set demo data for unauthenticated users
      setStreak(DEFAULT_STREAK);
      setIsAtRisk(false);
      setLoading(false);
      return;
    }

    const displayName = userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'User';
    let isMounted = true;

    // Initialize user streak with timeout fallback
    const initStreak = async () => {
      try {
        const initialStreak = await Promise.race([
          getOrCreateUserStreak(user.uid, displayName),
          new Promise<UserStreakRecord>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);
        
        if (isMounted) {
          setStreak(initialStreak);
          setIsAtRisk(isStreakAtRisk(initialStreak));
          setLoading(false);
        }
      } catch (error) {
        console.warn('Using fallback streak data:', error);
        if (isMounted) {
          // Use demo data as fallback
          setStreak({
            ...DEFAULT_STREAK,
            userId: user.uid,
            displayName,
          });
          setIsAtRisk(false);
          setLoading(false);
        }
      }
    };

    initStreak();

    // Subscribe to real-time updates
    const unsubStreak = subscribeToUserStreak(user.uid, (updatedStreak) => {
      if (updatedStreak && isMounted) {
        setStreak(updatedStreak);
        setIsAtRisk(isStreakAtRisk(updatedStreak));
      }
    });

    return () => {
      isMounted = false;
      unsubStreak();
    };
  }, [user, userProfile]);

  // Subscribe to public leaderboard with fallback
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Set timeout fallback
    timeoutId = setTimeout(() => {
      if (publicLeaderboard.length === 0) {
        setPublicLeaderboard(DEMO_PUBLIC_LEADERBOARD);
      }
    }, 3000);

    const unsub = subscribeToPublicLeaderboard((data) => {
      clearTimeout(timeoutId);
      if (data.length > 0) {
        setPublicLeaderboard(data);
      } else {
        setPublicLeaderboard(DEMO_PUBLIC_LEADERBOARD);
      }
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      unsub();
    };
  }, []);

  // Subscribe to competitive feed with fallback
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    timeoutId = setTimeout(() => {
      if (competitiveFeed.length === 0) {
        setCompetitiveFeed(DEMO_COMPETITIVE_FEED as any);
      }
    }, 3000);

    const unsub = subscribeToCompetitiveFeed((data) => {
      clearTimeout(timeoutId);
      if (data.length > 0) {
        setCompetitiveFeed(data);
      } else {
        setCompetitiveFeed(DEMO_COMPETITIVE_FEED as any);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      unsub();
    };
  }, []);

  // Load aggregate stats with fallback
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await Promise.race([
          getAggregateStats(),
          new Promise<typeof DEMO_AGGREGATE_STATS>((resolve) => 
            setTimeout(() => resolve(DEMO_AGGREGATE_STATS), 3000)
          )
        ]);
        setAggregateStats(stats);
      } catch (error) {
        console.warn('Using fallback aggregate stats:', error);
        setAggregateStats(DEMO_AGGREGATE_STATS);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  // Log health activity
  const logHealthActivity = useCallback(async () => {
    if (!user || !userProfile) return;

    try {
      const displayName = userProfile.displayName || user.displayName || user.email?.split('@')[0] || 'User';
      const updated = await updateHealthStreak(user.uid, displayName);
      setStreak(updated);
      setIsAtRisk(isStreakAtRisk(updated));
    } catch (error) {
      console.error('Error logging health activity:', error);
      throw error;
    }
  }, [user, userProfile]);

  // Log study activity
  const logStudyActivity = useCallback(async () => {
    if (!user || !userProfile) return;

    try {
      const displayName = userProfile.displayName || user.displayName || user.email?.split('@')[0] || 'User';
      const updated = await updateStudyStreak(user.uid, displayName);
      setStreak(updated);
      setIsAtRisk(isStreakAtRisk(updated));
    } catch (error) {
      console.error('Error logging study activity:', error);
      throw error;
    }
  }, [user, userProfile]);

  // Refresh streak data
  const refreshStreak = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const displayName = userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'User';
      const updated = await getOrCreateUserStreak(user.uid, displayName);
      setStreak(updated);
      setIsAtRisk(isStreakAtRisk(updated));
    } catch (error) {
      console.error('Error refreshing streak:', error);
    } finally {
      setLoading(false);
    }
  }, [user, userProfile]);

  return {
    streak,
    publicLeaderboard,
    competitiveFeed,
    loading,
    isAtRisk,
    logHealthActivity,
    logStudyActivity,
    refreshStreak,
    aggregateStats,
  };
};

export default useStreak;
