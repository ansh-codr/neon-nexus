import { useState, useEffect, useCallback } from 'react';
import {
  connectGoogleFit,
  disconnectGoogleFit,
  isGoogleFitConnected,
  fetchTodayData,
  fetchWeeklyData,
  getCachedFitData,
  calculateStreakFromFitData,
  calculateDedicationFromFit,
  type GoogleFitData,
  type DailyFitData,
} from '@/firebase/googleFit';

export interface UseGoogleFitReturn {
  // Connection state
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  connect: () => Promise<boolean>;
  disconnect: () => void;
  refresh: () => Promise<void>;
  
  // Data
  todayData: GoogleFitData | null;
  weeklyData: DailyFitData[];
  
  // Computed
  streak: {
    current: number;
    best: number;
    activeDays: number;
  };
  dedication: {
    score: number;
    level: 'Rookie' | 'Committed' | 'Dedicated' | 'Elite' | 'Legend';
    label: string;
  };
}

export function useGoogleFit(): UseGoogleFitReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayData, setTodayData] = useState<GoogleFitData | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyFitData[]>([]);
  
  // Check connection status on mount
  useEffect(() => {
    const connected = isGoogleFitConnected();
    setIsConnected(connected);
    
    // Load cached data if available
    const cached = getCachedFitData();
    if (cached) {
      setTodayData(cached);
    }
    
    setIsLoading(false);
  }, []);
  
  // Fetch data when connected
  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
  }, [isConnected]);
  
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [today, weekly] = await Promise.all([
        fetchTodayData(),
        fetchWeeklyData(),
      ]);
      
      setTodayData(today);
      setWeeklyData(weekly);
    } catch (err) {
      console.error('Error fetching Google Fit data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      
      // If auth error, mark as disconnected
      if (err instanceof Error && err.message.includes('authenticated')) {
        setIsConnected(false);
        disconnectGoogleFit();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const connect = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await connectGoogleFit();
      
      if (result.success) {
        setIsConnected(true);
        // Fetch data after connecting
        await fetchData();
        return true;
      } else {
        setError(result.error || 'Failed to connect');
        return false;
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const disconnect = useCallback(() => {
    disconnectGoogleFit();
    setIsConnected(false);
    setTodayData(null);
    setWeeklyData([]);
  }, []);
  
  const refresh = useCallback(async () => {
    if (isConnected) {
      await fetchData();
    }
  }, [isConnected]);
  
  // Computed values
  const streak = weeklyData.length > 0
    ? calculateStreakFromFitData(weeklyData)
    : { current: 0, best: 0, activeDays: 0 };
  
  const dedication = calculateDedicationFromFit(weeklyData);
  
  return {
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    refresh,
    todayData,
    weeklyData,
    streak,
    dedication,
  };
}

export default useGoogleFit;
