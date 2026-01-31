/**
 * Google Fit API Integration
 * 
 * Fetches health data directly from Google Fit REST API.
 * Works on Android phones without a smartwatch - uses phone sensors.
 * 
 * Data available WITHOUT a watch:
 * - Steps (phone accelerometer)
 * - Activity duration
 * - Movement/walking time
 * - Distance estimates
 */

import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';

// Google Fit API endpoints
const FIT_API_BASE = 'https://www.googleapis.com/fitness/v1/users/me';

// Data source IDs for different metrics
const DATA_SOURCES = {
  steps: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
  calories: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
  activeMinutes: 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes',
  distance: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
  heartRate: 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm',
  sleep: 'derived:com.google.sleep.segment:com.google.android.gms:merged',
};

// Scopes required for Google Fit
export const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.location.read',
];

export interface GoogleFitData {
  steps: number;
  calories: number;
  activeMinutes: number;
  distance: number; // in meters
  heartRate: number | null; // average BPM if available
  sleepHours: number | null;
  lastSynced: Date;
  isConnected: boolean;
}

export interface DailyFitData {
  date: string; // YYYY-MM-DD
  steps: number;
  calories: number;
  activeMinutes: number;
  distance: number;
}

// Store access token in memory (short-lived)
let fitAccessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Sign in with Google and request Fit permissions
 */
export async function connectGoogleFit(): Promise<{ success: boolean; error?: string }> {
  try {
    const provider = new GoogleAuthProvider();
    
    // Add Fit scopes
    GOOGLE_FIT_SCOPES.forEach(scope => {
      provider.addScope(scope);
    });
    
    // Request offline access for refresh token
    provider.setCustomParameters({
      access_type: 'offline',
      prompt: 'consent',
    });
    
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (credential?.accessToken) {
      fitAccessToken = credential.accessToken;
      tokenExpiry = Date.now() + 3600 * 1000; // 1 hour
      
      // Store connection status
      localStorage.setItem('googleFitConnected', 'true');
      localStorage.setItem('googleFitEmail', result.user.email || '');
      
      return { success: true };
    }
    
    return { success: false, error: 'Could not get access token' };
  } catch (error: unknown) {
    console.error('Google Fit connection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
    return { success: false, error: errorMessage };
  }
}

/**
 * Check if Google Fit is connected
 */
export function isGoogleFitConnected(): boolean {
  return localStorage.getItem('googleFitConnected') === 'true';
}

/**
 * Disconnect Google Fit
 */
export function disconnectGoogleFit(): void {
  fitAccessToken = null;
  tokenExpiry = 0;
  localStorage.removeItem('googleFitConnected');
  localStorage.removeItem('googleFitEmail');
  localStorage.removeItem('googleFitCache');
}

/**
 * Get a valid access token (re-auth if needed)
 */
async function getAccessToken(): Promise<string | null> {
  // If we have a valid token, use it
  if (fitAccessToken && Date.now() < tokenExpiry) {
    return fitAccessToken;
  }
  
  // Try to get a new token via silent sign-in
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const provider = new GoogleAuthProvider();
    GOOGLE_FIT_SCOPES.forEach(scope => provider.addScope(scope));
    
    // For web, we need to re-auth to get a fresh token
    // In production, you'd use a backend to refresh tokens
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (credential?.accessToken) {
      fitAccessToken = credential.accessToken;
      tokenExpiry = Date.now() + 3600 * 1000;
      return fitAccessToken;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
  }
  
  return null;
}

/**
 * Convert nanoseconds to milliseconds
 */
function nanoToMillis(nanos: string): number {
  return Math.floor(parseInt(nanos) / 1000000);
}

/**
 * Get time range for today (midnight to now)
 */
function getTodayTimeRange(): { startTimeNanos: string; endTimeNanos: string } {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return {
    startTimeNanos: (startOfDay.getTime() * 1000000).toString(),
    endTimeNanos: (now.getTime() * 1000000).toString(),
  };
}

/**
 * Get time range for past N days
 */
function getPastDaysTimeRange(days: number): { startTimeNanos: string; endTimeNanos: string } {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
  
  return {
    startTimeNanos: (startDate.getTime() * 1000000).toString(),
    endTimeNanos: (now.getTime() * 1000000).toString(),
  };
}

/**
 * Fetch aggregate data from Google Fit
 */
async function fetchAggregateData(
  dataTypeName: string,
  startTimeNanos: string,
  endTimeNanos: string,
  bucketByTime?: number // milliseconds per bucket
): Promise<number[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Fit');
  }
  
  const body: Record<string, unknown> = {
    aggregateBy: [{
      dataTypeName,
    }],
    startTimeMillis: nanoToMillis(startTimeNanos),
    endTimeMillis: nanoToMillis(endTimeNanos),
  };
  
  if (bucketByTime) {
    body.bucketByTime = { durationMillis: bucketByTime };
  } else {
    body.bucketByTime = { durationMillis: 86400000 }; // 1 day default
  }
  
  const response = await fetch(`${FIT_API_BASE}/dataset:aggregate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Fit API error:', errorText);
    throw new Error(`Google Fit API error: ${response.status}`);
  }
  
  const data = await response.json();
  const values: number[] = [];
  
  if (data.bucket) {
    for (const bucket of data.bucket) {
      let bucketValue = 0;
      if (bucket.dataset) {
        for (const dataset of bucket.dataset) {
          if (dataset.point) {
            for (const point of dataset.point) {
              if (point.value && point.value[0]) {
                // Handle different value types
                if (point.value[0].intVal !== undefined) {
                  bucketValue += point.value[0].intVal;
                } else if (point.value[0].fpVal !== undefined) {
                  bucketValue += point.value[0].fpVal;
                }
              }
            }
          }
        }
      }
      values.push(bucketValue);
    }
  }
  
  return values;
}

/**
 * Fetch today's health data from Google Fit
 */
export async function fetchTodayData(): Promise<GoogleFitData> {
  const { startTimeNanos, endTimeNanos } = getTodayTimeRange();
  
  try {
    // Fetch all metrics in parallel
    const [stepsData, caloriesData, activeMinutesData, distanceData] = await Promise.all([
      fetchAggregateData('com.google.step_count.delta', startTimeNanos, endTimeNanos)
        .catch(() => [0]),
      fetchAggregateData('com.google.calories.expended', startTimeNanos, endTimeNanos)
        .catch(() => [0]),
      fetchAggregateData('com.google.active_minutes', startTimeNanos, endTimeNanos)
        .catch(() => [0]),
      fetchAggregateData('com.google.distance.delta', startTimeNanos, endTimeNanos)
        .catch(() => [0]),
    ]);
    
    const result: GoogleFitData = {
      steps: stepsData.reduce((a, b) => a + b, 0),
      calories: Math.round(caloriesData.reduce((a, b) => a + b, 0)),
      activeMinutes: Math.round(activeMinutesData.reduce((a, b) => a + b, 0)),
      distance: Math.round(distanceData.reduce((a, b) => a + b, 0)),
      heartRate: null, // Would need continuous monitoring
      sleepHours: null, // Fetch separately if needed
      lastSynced: new Date(),
      isConnected: true,
    };
    
    // Cache the result
    localStorage.setItem('googleFitCache', JSON.stringify({
      data: result,
      timestamp: Date.now(),
    }));
    
    return result;
  } catch (error) {
    console.error('Error fetching Google Fit data:', error);
    throw error;
  }
}

/**
 * Fetch weekly data (past 7 days) from Google Fit
 */
export async function fetchWeeklyData(): Promise<DailyFitData[]> {
  const { startTimeNanos, endTimeNanos } = getPastDaysTimeRange(7);
  const oneDayMs = 86400000;
  
  try {
    const [stepsData, caloriesData, activeMinutesData, distanceData] = await Promise.all([
      fetchAggregateData('com.google.step_count.delta', startTimeNanos, endTimeNanos, oneDayMs)
        .catch(() => Array(7).fill(0)),
      fetchAggregateData('com.google.calories.expended', startTimeNanos, endTimeNanos, oneDayMs)
        .catch(() => Array(7).fill(0)),
      fetchAggregateData('com.google.active_minutes', startTimeNanos, endTimeNanos, oneDayMs)
        .catch(() => Array(7).fill(0)),
      fetchAggregateData('com.google.distance.delta', startTimeNanos, endTimeNanos, oneDayMs)
        .catch(() => Array(7).fill(0)),
    ]);
    
    const result: DailyFitData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      result.push({
        date: date.toISOString().split('T')[0],
        steps: stepsData[i] || 0,
        calories: Math.round(caloriesData[i] || 0),
        activeMinutes: Math.round(activeMinutesData[i] || 0),
        distance: Math.round(distanceData[i] || 0),
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    throw error;
  }
}

/**
 * Get cached data if available and fresh
 */
export function getCachedFitData(): GoogleFitData | null {
  const cached = localStorage.getItem('googleFitCache');
  if (!cached) return null;
  
  try {
    const { data, timestamp } = JSON.parse(cached);
    // Cache valid for 5 minutes
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
  } catch {
    return null;
  }
  
  return null;
}

/**
 * Calculate streak data from weekly data
 */
export function calculateStreakFromFitData(weeklyData: DailyFitData[]): {
  currentStreak: number;
  bestStreak: number;
  activeDays: number;
} {
  // Define "active day" as 5000+ steps OR 30+ active minutes
  const isActiveDay = (day: DailyFitData) => day.steps >= 5000 || day.activeMinutes >= 30;
  
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let activeDays = 0;
  
  // Count from most recent day backwards for current streak
  for (let i = weeklyData.length - 1; i >= 0; i--) {
    if (isActiveDay(weeklyData[i])) {
      if (i === weeklyData.length - 1 || isActiveDay(weeklyData[i + 1])) {
        currentStreak++;
      }
      activeDays++;
    } else if (i === weeklyData.length - 1) {
      // Today not active yet, check yesterday
      continue;
    } else {
      break;
    }
  }
  
  // Calculate best streak
  for (const day of weeklyData) {
    if (isActiveDay(day)) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  return { currentStreak, bestStreak, activeDays };
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Calculate dedication score based on Fit data
 */
export function calculateDedicationFromFit(
  weeklyData: DailyFitData[],
  goals: { steps: number; activeMinutes: number } = { steps: 10000, activeMinutes: 60 }
): {
  score: number;
  level: 'Rookie' | 'Committed' | 'Dedicated' | 'Elite' | 'Legend';
  label: string;
} {
  if (weeklyData.length === 0) {
    return { score: 0, level: 'Rookie', label: 'Just Getting Started' };
  }
  
  // Calculate consistency (how many days met at least one goal)
  const consistentDays = weeklyData.filter(
    day => day.steps >= goals.steps * 0.5 || day.activeMinutes >= goals.activeMinutes * 0.5
  ).length;
  
  // Calculate average achievement
  const avgStepRatio = weeklyData.reduce((sum, day) => sum + day.steps / goals.steps, 0) / weeklyData.length;
  const avgActiveRatio = weeklyData.reduce((sum, day) => sum + day.activeMinutes / goals.activeMinutes, 0) / weeklyData.length;
  
  // Weighted score
  const consistencyScore = (consistentDays / 7) * 40;
  const performanceScore = Math.min(((avgStepRatio + avgActiveRatio) / 2), 1.5) * 40;
  const streakBonus = calculateStreakFromFitData(weeklyData).currentStreak * 3;
  
  const score = Math.min(Math.round(consistencyScore + performanceScore + streakBonus), 100);
  
  // Determine level
  let level: 'Rookie' | 'Committed' | 'Dedicated' | 'Elite' | 'Legend';
  let label: string;
  
  if (score >= 90) {
    level = 'Legend';
    label = 'Unstoppable Force';
  } else if (score >= 75) {
    level = 'Elite';
    label = 'Peak Performer';
  } else if (score >= 55) {
    level = 'Dedicated';
    label = 'Consistent Achiever';
  } else if (score >= 35) {
    level = 'Committed';
    label = 'Building Momentum';
  } else {
    level = 'Rookie';
    label = 'Just Getting Started';
  }
  
  return { score, level, label };
}
