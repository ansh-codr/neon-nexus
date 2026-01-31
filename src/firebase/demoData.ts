// Demo data and account configuration
// This provides mock data for demonstration purposes

import { DedicationLevel } from './streaks';

// Demo account credentials
export const DEMO_ACCOUNT = {
  email: 'demo@neonnexus.app',
  password: 'demo123456',
  displayName: 'Demo User',
};

// Demo health data
export const DEMO_HEALTH_DATA = {
  sleepHours: 7.5,
  steps: 8234,
  activityLevel: 'medium' as const,
  focusLevel: 'high' as const,
  stressLevel: 'medium' as const,
  healthScore: 78,
  date: new Date().toISOString().split('T')[0],
};

// Demo streak data
export const DEMO_STREAK_DATA = {
  userId: 'demo-user',
  displayName: 'Demo User',
  healthStreak: 5,
  studyStreak: 3,
  combinedScore: 24,
  dedicationLevel: 'Focused' as DedicationLevel,
  lastActiveDate: new Date().toISOString().split('T')[0],
  lastHealthLog: new Date().toISOString().split('T')[0],
  lastStudyLog: new Date().toISOString().split('T')[0],
  totalDaysLogged: 12,
};

// Demo weekly data
export const DEMO_WEEKLY_DATA = [
  { day: 'Mon', sleep: 7.2, steps: 6500, score: 72 },
  { day: 'Tue', sleep: 6.8, steps: 8200, score: 68 },
  { day: 'Wed', sleep: 7.5, steps: 9100, score: 76 },
  { day: 'Thu', sleep: 8.0, steps: 7800, score: 82 },
  { day: 'Fri', sleep: 6.5, steps: 5400, score: 65 },
  { day: 'Sat', sleep: 8.5, steps: 10200, score: 85 },
  { day: 'Sun', sleep: 7.5, steps: 8234, score: 78 },
];

// Demo competitive feed
export const DEMO_COMPETITIVE_FEED = [
  {
    type: 'collective' as const,
    message: '12 students logged progress today',
    count: 12,
    date: new Date().toISOString().split('T')[0],
  },
  {
    type: 'top_streak' as const,
    message: 'Top consistency streak this week: 9 days',
    count: 9,
    date: new Date().toISOString().split('T')[0],
  },
  {
    type: 'milestone' as const,
    message: '3 students hit a milestone this week!',
    count: 3,
    date: new Date().toISOString().split('T')[0],
  },
];

// Demo public leaderboard (limited visibility - no raw metrics)
export const DEMO_PUBLIC_LEADERBOARD = [
  { userId: 'user1', displayName: 'Adarsh', dedicationLevel: 'Highly Dedicated' as DedicationLevel, currentStreak: 9, badge: '🏆' },
  { userId: 'user2', displayName: 'Priya', dedicationLevel: 'Focused' as DedicationLevel, currentStreak: 7, badge: '🎯' },
  { userId: 'user3', displayName: 'Sachin', dedicationLevel: 'Focused' as DedicationLevel, currentStreak: 6, badge: '🎯' },
  { userId: 'user4', displayName: 'Ayush', dedicationLevel: 'Consistent' as DedicationLevel, currentStreak: 5, badge: '⚡' },
  { userId: 'demo-user', displayName: 'You', dedicationLevel: 'Focused' as DedicationLevel, currentStreak: 5, badge: '🎯' },
  { userId: 'user5', displayName: 'Brajesh', dedicationLevel: 'Consistent' as DedicationLevel, currentStreak: 4, badge: '⚡' },
  { userId: 'user6', displayName: 'Tanwar', dedicationLevel: 'Getting Started' as DedicationLevel, currentStreak: 2, badge: '🌱' },
];

// Demo insights
export const DEMO_INSIGHTS = [
  "You got 7.5 hours of sleep - right in the sweet spot!",
  "Great focus today! Keep building on this momentum.",
  "With 8,234 steps, you're staying active. Keep it up!",
];

// Demo AI quotes
export const DEMO_QUOTES = {
  normal: [
    "Rest is part of the journey, not a detour.",
    "Progress over perfection, always.",
    "Today's small step is tomorrow's giant leap.",
  ],
  exam: [
    "Exams measure a moment, not your worth.",
    "Your brain works better when you rest it.",
    "Pace yourself. The finish line will wait.",
  ],
};

// Demo dedication insights
export const DEMO_DEDICATION_INSIGHTS = {
  'Getting Started': "Your journey begins with a single step. Keep showing up.",
  'Consistent': "Consistency is your superpower. It's showing.",
  'Focused': "Your dedication is becoming a pattern. Well done.",
  'Highly Dedicated': "Balance and dedication - you've mastered both.",
};

// Demo competitive insight
export const DEMO_COMPETITIVE_INSIGHT = "The campus is moving together. Every log counts.";

// Demo aggregate stats
export const DEMO_AGGREGATE_STATS = {
  activeUsers: 12,
  topStreak: 9,
  avgConsistency: 45,
};

// Check if using demo mode
export const isDemoMode = (userId?: string): boolean => {
  return userId === 'demo-user' || !userId;
};

// Get demo data with optional variations
export const getDemoHealthData = (variation: number = 0) => {
  const base = { ...DEMO_HEALTH_DATA };
  base.sleepHours = Math.max(5, Math.min(9, base.sleepHours + (Math.random() - 0.5)));
  base.steps = Math.floor(base.steps + (Math.random() - 0.5) * 2000);
  base.healthScore = Math.max(50, Math.min(95, base.healthScore + Math.floor((Math.random() - 0.5) * 10)));
  return base;
};

// Get random quote
export const getRandomQuote = (examMode: boolean = false): string => {
  const quotes = examMode ? DEMO_QUOTES.exam : DEMO_QUOTES.normal;
  return quotes[Math.floor(Math.random() * quotes.length)];
};

// Get dedication insight
export const getDemoInsight = (level: DedicationLevel): string => {
  return DEMO_DEDICATION_INSIGHTS[level];
};
