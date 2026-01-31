// Firebase core exports
export { app, auth, db, storage, analytics } from './firebase';

// Auth exports
export {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithGithub,
  signInWithMicrosoft,
  logOut,
  resetPassword,
  updateUserProfile,
  getCurrentUser,
  onAuthChange,
} from './auth';

// Firestore exports
export {
  COLLECTIONS,
  createDocument,
  setDocument,
  getDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  subscribeToDocument,
  subscribeToCollection,
  saveUserProfile,
  getUserProfile,
  saveHealthData,
  getHealthData,
  getWeeklyTrends,
  subscribeToHealthData,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from './firestore';

// Admin exports
export {
  ADMIN_COLLECTIONS,
  getAllUsers,
  getAllHealthData,
  createMockUser,
  updateMockUser,
  deleteMockUser,
  createMockHealthData,
  getLeaderboard,
  subscribeToLeaderboard,
  initializeMockData,
} from './admin';

// Streak exports
export {
  STREAK_COLLECTIONS,
  getOrCreateUserStreak,
  updateHealthStreak,
  updateStudyStreak,
  getPublicSnapshots,
  subscribeToUserStreak,
  subscribeToPublicLeaderboard,
  getCompetitiveFeed,
  subscribeToCompetitiveFeed,
  isStreakAtRisk,
  getAggregateStats,
  calculateDedicationLevel,
  calculateBalanceScore,
  getBadge,
} from './streaks';

// AI Service exports
export {
  generateDedicationInsight,
  generateCompetitiveInsight,
  generateComparisonInsight,
  generateQuoteOfTheDay,
  generateStreakRiskMessage,
  generateDashboardInsights,
  PROMPT_TEMPLATES,
} from './aiService';

// Type exports
export type {
  UserProfile,
  HealthDataDoc,
  WeeklyTrendDoc,
} from './firestore';

export type {
  MockUser,
  MockHealthData,
  LeaderboardEntry,
} from './admin';

export type {
  UserStreakRecord,
  PublicUserSnapshot,
  DailySummary,
  CompetitiveFeedItem,
  DailyQuote,
  DedicationLevel,
} from './streaks';

export type {
  CachedQuote,
  AIInsight,
  DashboardInsights,
} from './aiService';

export type {
  MockUser,
  MockHealthData,
  LeaderboardEntry,
} from './admin';
