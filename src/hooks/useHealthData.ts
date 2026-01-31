import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  subscribeToHealthData,
  saveHealthData,
  getWeeklyTrends,
  HealthDataDoc,
  WeeklyTrendDoc,
} from '@/firebase';

export interface HealthMetrics {
  sleepHours: number;
  steps: number;
  activityLevel: 'low' | 'medium' | 'high';
  focusLevel: 'low' | 'medium' | 'high';
  stressLevel: 'low' | 'medium' | 'high';
  healthScore: number;
  date: string;
}

export interface WeeklyDataPoint {
  day: string;
  sleep: number;
  steps: number;
  score: number;
}

// Calculate health score based on metrics
const calculateHealthScore = (metrics: Partial<HealthMetrics>): number => {
  let score = 50; // Base score

  // Sleep contribution (0-30 points)
  if (metrics.sleepHours) {
    if (metrics.sleepHours >= 7 && metrics.sleepHours <= 9) {
      score += 30;
    } else if (metrics.sleepHours >= 6 && metrics.sleepHours < 7) {
      score += 20;
    } else if (metrics.sleepHours >= 5 && metrics.sleepHours < 6) {
      score += 10;
    }
  }

  // Activity contribution (0-20 points)
  if (metrics.activityLevel === 'high') score += 20;
  else if (metrics.activityLevel === 'medium') score += 12;
  else if (metrics.activityLevel === 'low') score += 5;

  // Focus contribution (0-15 points)
  if (metrics.focusLevel === 'high') score += 15;
  else if (metrics.focusLevel === 'medium') score += 10;
  else if (metrics.focusLevel === 'low') score += 3;

  // Stress penalty (-15 to 0 points)
  if (metrics.stressLevel === 'high') score -= 15;
  else if (metrics.stressLevel === 'medium') score -= 5;

  return Math.min(100, Math.max(0, score));
};

// Generate AI insights based on metrics
const generateInsights = (metrics: HealthMetrics, examMode: boolean): string[] => {
  const insights: string[] = [];

  if (examMode) {
    if (metrics.sleepHours < 6) {
      insights.push("During exams, sleep is crucial for memory consolidation. Even 30 extra minutes helps.");
    }
    if (metrics.stressLevel === 'high') {
      insights.push("Take it easy. A 5-minute breathing break can help reset your focus.");
    }
    insights.push("Remember: sustainable effort beats cramming. You're doing better than you think.");
  } else {
    if (metrics.sleepHours < 7) {
      insights.push(`You got ${metrics.sleepHours.toFixed(1)} hours of sleep. Try winding down 30 minutes earlier tonight.`);
    }
    if (metrics.activityLevel === 'low') {
      insights.push("A short walk could boost your energy and focus for the rest of the day.");
    }
    if (metrics.focusLevel === 'high') {
      insights.push("Great focus today! Keep building on this momentum.");
    }
    if (metrics.steps < 5000) {
      insights.push("Try to get some movement in. Even a short walk between classes helps.");
    } else if (metrics.steps >= 10000) {
      insights.push("Excellent activity level! Your body will thank you.");
    }
  }

  // Always have at least one insight
  if (insights.length === 0) {
    insights.push("You're maintaining good balance. Keep it up!");
  }

  return insights.slice(0, 3); // Max 3 insights
};

// Generate weekly summary
const generateWeeklySummary = (weeklyData: WeeklyDataPoint[], examMode: boolean): string => {
  if (weeklyData.length === 0) {
    return "Start tracking to see your weekly trends!";
  }

  const avgSleep = weeklyData.reduce((sum, d) => sum + d.sleep, 0) / weeklyData.length;
  const avgScore = weeklyData.reduce((sum, d) => sum + d.score, 0) / weeklyData.length;
  const trend = weeklyData.length >= 2 
    ? weeklyData[weeklyData.length - 1].score - weeklyData[0].score 
    : 0;

  if (examMode) {
    return `This week you've maintained ${avgSleep.toFixed(1)} hours average sleep. ${trend >= 0 ? "Your wellness is trending up" : "Remember to prioritize rest"} despite the pressure.`;
  }

  return `Your week shows ${avgSleep.toFixed(1)} hours average sleep and ${avgScore.toFixed(0)} average health score. ${trend >= 0 ? "You're building positive momentum!" : "Small improvements each day add up."}`;
};

export const useHealthData = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayData, setTodayData] = useState<HealthMetrics | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];

  // Subscribe to real-time health data updates
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToHealthData(user.uid, (data: HealthDataDoc[]) => {
      // Find today's data
      const todayEntry = data.find(d => d.date === today);
      
      if (todayEntry) {
        const metrics: HealthMetrics = {
          sleepHours: todayEntry.sleepHours,
          steps: todayEntry.steps,
          activityLevel: todayEntry.activityLevel,
          focusLevel: todayEntry.focusLevel,
          stressLevel: todayEntry.stressLevel,
          healthScore: todayEntry.healthScore,
          date: todayEntry.date,
        };
        setTodayData(metrics);
        setInsights(generateInsights(metrics, userProfile?.examMode || false));
      } else {
        setTodayData(null);
      }

      // Convert to weekly data format (last 7 days)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekly = data.slice(0, 7).reverse().map(d => ({
        day: days[new Date(d.date).getDay()],
        sleep: d.sleepHours,
        steps: d.steps,
        score: d.healthScore,
      }));
      setWeeklyData(weekly);
      setWeeklySummary(generateWeeklySummary(weekly, userProfile?.examMode || false));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, today, userProfile?.examMode]);

  // Fetch weekly trends separately
  useEffect(() => {
    if (!user) return;

    const fetchWeekly = async () => {
      try {
        const trends = await getWeeklyTrends(user.uid);
        if (trends.length > 0) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const weekly = trends.reverse().map((t: WeeklyTrendDoc) => ({
            day: days[new Date(t.date).getDay()],
            sleep: t.sleep,
            steps: t.steps,
            score: t.score,
          }));
          setWeeklyData(weekly);
        }
      } catch (err) {
        console.error('Error fetching weekly trends:', err);
      }
    };

    fetchWeekly();
  }, [user]);

  // Update insights when exam mode changes
  useEffect(() => {
    if (todayData) {
      setInsights(generateInsights(todayData, userProfile?.examMode || false));
      setWeeklySummary(generateWeeklySummary(weeklyData, userProfile?.examMode || false));
    }
  }, [userProfile?.examMode, todayData, weeklyData]);

  // Save health data for today
  const saveToday = useCallback(async (data: Partial<HealthMetrics>) => {
    if (!user) {
      setError('Please log in to save health data');
      return;
    }

    try {
      const healthScore = calculateHealthScore(data);
      await saveHealthData(user.uid, {
        sleepHours: data.sleepHours || 0,
        steps: data.steps || 0,
        activityLevel: data.activityLevel || 'medium',
        focusLevel: data.focusLevel || 'medium',
        stressLevel: data.stressLevel || 'medium',
        healthScore,
        date: today,
      });
      setError(null);
    } catch (err) {
      console.error('Error saving health data:', err);
      setError('Failed to save health data');
    }
  }, [user, today]);

  // Refresh insights
  const refreshInsights = useCallback(() => {
    if (todayData) {
      setInsights(generateInsights(todayData, userProfile?.examMode || false));
    }
  }, [todayData, userProfile?.examMode]);

  return {
    loading,
    error,
    todayData,
    weeklyData,
    insights,
    weeklySummary,
    saveToday,
    refreshInsights,
    isAuthenticated: !!user,
  };
};

export default useHealthData;
