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

export const useStreak = (): UseStreakReturn => {
  const { user, userProfile } = useAuth();
  const [streak, setStreak] = useState<UserStreakRecord | null>(null);
  const [publicLeaderboard, setPublicLeaderboard] = useState<PublicUserSnapshot[]>([]);
  const [competitiveFeed, setCompetitiveFeed] = useState<CompetitiveFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [aggregateStats, setAggregateStats] = useState<{
    activeUsers: number;
    topStreak: number;
    avgConsistency: number;
  } | null>(null);

  // Initialize streak data
  useEffect(() => {
    if (!user) {
      setStreak(null);
      setLoading(false);
      return;
    }

    const displayName = userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'User';

    // Initialize user streak
    getOrCreateUserStreak(user.uid, displayName)
      .then(initialStreak => {
        setStreak(initialStreak);
        setIsAtRisk(isStreakAtRisk(initialStreak));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error initializing streak:', error);
        setLoading(false);
      });

    // Subscribe to real-time updates
    const unsubStreak = subscribeToUserStreak(user.uid, (updatedStreak) => {
      if (updatedStreak) {
        setStreak(updatedStreak);
        setIsAtRisk(isStreakAtRisk(updatedStreak));
      }
    });

    return () => unsubStreak();
  }, [user, userProfile]);

  // Subscribe to public leaderboard
  useEffect(() => {
    const unsub = subscribeToPublicLeaderboard(setPublicLeaderboard, 10);
    return () => unsub();
  }, []);

  // Subscribe to competitive feed
  useEffect(() => {
    const unsub = subscribeToCompetitiveFeed(setCompetitiveFeed);
    return () => unsub();
  }, []);

  // Load aggregate stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getAggregateStats();
        setAggregateStats(stats);
      } catch (error) {
        console.error('Error loading aggregate stats:', error);
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
