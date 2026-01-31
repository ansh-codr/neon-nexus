import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
export const STREAK_COLLECTIONS = {
  USER_STREAKS: 'userStreaks',
  DAILY_SUMMARIES: 'dailySummaries',
  COMPETITIVE_FEED: 'competitiveFeed',
  DAILY_QUOTES: 'dailyQuotes',
} as const;

// Types
export interface UserStreakRecord {
  id?: string;
  userId: string;
  displayName: string;
  healthStreak: number;
  studyStreak: number;
  combinedScore: number;
  dedicationLevel: DedicationLevel;
  lastActiveDate: string;
  lastHealthLog: string | null;
  lastStudyLog: string | null;
  totalDaysLogged: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PublicUserSnapshot {
  userId: string;
  displayName: string;
  dedicationLevel: DedicationLevel;
  currentStreak: number;
  badge: string;
}

export interface DailySummary {
  id?: string;
  userId: string;
  date: string;
  healthLogged: boolean;
  studyLogged: boolean;
  balanceScore: number;
  createdAt: Timestamp;
}

export interface CompetitiveFeedItem {
  id?: string;
  type: 'streak_extended' | 'top_streak' | 'milestone' | 'collective';
  message: string;
  count?: number;
  date: string;
  createdAt: Timestamp;
}

export interface DailyQuote {
  id?: string;
  quote: string;
  date: string;
  context: {
    examMode: boolean;
    avgStressLevel: string;
  };
  createdAt: Timestamp;
}

export type DedicationLevel = 'Getting Started' | 'Consistent' | 'Focused' | 'Highly Dedicated';

// Calculate dedication level based on streaks and balance
export const calculateDedicationLevel = (
  healthStreak: number,
  studyStreak: number,
  balanceScore: number
): DedicationLevel => {
  const combinedStreak = Math.min(healthStreak, studyStreak);
  const avgStreak = (healthStreak + studyStreak) / 2;

  // Favor balance over extremes
  if (combinedStreak >= 7 && balanceScore >= 0.7) {
    return 'Highly Dedicated';
  } else if (combinedStreak >= 4 || (avgStreak >= 5 && balanceScore >= 0.5)) {
    return 'Focused';
  } else if (combinedStreak >= 2 || avgStreak >= 3) {
    return 'Consistent';
  }
  return 'Getting Started';
};

// Calculate balance score (0-1)
export const calculateBalanceScore = (healthStreak: number, studyStreak: number): number => {
  if (healthStreak === 0 && studyStreak === 0) return 0;
  const max = Math.max(healthStreak, studyStreak);
  const min = Math.min(healthStreak, studyStreak);
  return max > 0 ? min / max : 0;
};

// Get badge based on dedication level
export const getBadge = (level: DedicationLevel): string => {
  switch (level) {
    case 'Highly Dedicated':
      return '🏆';
    case 'Focused':
      return '🎯';
    case 'Consistent':
      return '⚡';
    case 'Getting Started':
    default:
      return '🌱';
  }
};

// Get or create user streak record
export const getOrCreateUserStreak = async (
  userId: string,
  displayName: string
): Promise<UserStreakRecord> => {
  const docRef = doc(db, STREAK_COLLECTIONS.USER_STREAKS, userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserStreakRecord;
  }

  // Create new record
  const newRecord: Omit<UserStreakRecord, 'id' | 'createdAt' | 'updatedAt'> = {
    userId,
    displayName,
    healthStreak: 0,
    studyStreak: 0,
    combinedScore: 0,
    dedicationLevel: 'Getting Started',
    lastActiveDate: '',
    lastHealthLog: null,
    lastStudyLog: null,
    totalDaysLogged: 0,
  };

  await setDoc(docRef, {
    ...newRecord,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: userId, ...newRecord } as UserStreakRecord;
};

// Update user streak after logging health data
export const updateHealthStreak = async (
  userId: string,
  displayName: string
): Promise<UserStreakRecord> => {
  const today = new Date().toISOString().split('T')[0];
  const streak = await getOrCreateUserStreak(userId, displayName);

  // Check if already logged today
  if (streak.lastHealthLog === today) {
    return streak;
  }

  // Calculate if streak continues or resets
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newHealthStreak = streak.healthStreak;

  if (streak.lastHealthLog === yesterdayStr) {
    // Streak continues
    newHealthStreak += 1;
  } else if (streak.lastHealthLog === today) {
    // Already logged today
    return streak;
  } else {
    // Soft decay - don't completely reset, reduce by half
    newHealthStreak = Math.max(1, Math.floor(streak.healthStreak / 2));
  }

  const balanceScore = calculateBalanceScore(newHealthStreak, streak.studyStreak);
  const dedicationLevel = calculateDedicationLevel(newHealthStreak, streak.studyStreak, balanceScore);
  const combinedScore = Math.round((newHealthStreak + streak.studyStreak) * balanceScore);

  const updates = {
    healthStreak: newHealthStreak,
    lastHealthLog: today,
    lastActiveDate: today,
    combinedScore,
    dedicationLevel,
    totalDaysLogged: streak.totalDaysLogged + 1,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, STREAK_COLLECTIONS.USER_STREAKS, userId), updates);

  // Log daily summary
  await logDailySummary(userId, today, true, streak.lastStudyLog === today);

  return { ...streak, ...updates } as UserStreakRecord;
};

// Update user streak after logging study data
export const updateStudyStreak = async (
  userId: string,
  displayName: string
): Promise<UserStreakRecord> => {
  const today = new Date().toISOString().split('T')[0];
  const streak = await getOrCreateUserStreak(userId, displayName);

  if (streak.lastStudyLog === today) {
    return streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStudyStreak = streak.studyStreak;

  if (streak.lastStudyLog === yesterdayStr) {
    newStudyStreak += 1;
  } else if (streak.lastStudyLog === today) {
    return streak;
  } else {
    newStudyStreak = Math.max(1, Math.floor(streak.studyStreak / 2));
  }

  const balanceScore = calculateBalanceScore(streak.healthStreak, newStudyStreak);
  const dedicationLevel = calculateDedicationLevel(streak.healthStreak, newStudyStreak, balanceScore);
  const combinedScore = Math.round((streak.healthStreak + newStudyStreak) * balanceScore);

  const updates = {
    studyStreak: newStudyStreak,
    lastStudyLog: today,
    lastActiveDate: today,
    combinedScore,
    dedicationLevel,
    totalDaysLogged: streak.totalDaysLogged + 1,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, STREAK_COLLECTIONS.USER_STREAKS, userId), updates);

  await logDailySummary(userId, today, streak.lastHealthLog === today, true);

  return { ...streak, ...updates } as UserStreakRecord;
};

// Log daily summary
const logDailySummary = async (
  userId: string,
  date: string,
  healthLogged: boolean,
  studyLogged: boolean
): Promise<void> => {
  const docId = `${userId}_${date}`;
  const balanceScore = healthLogged && studyLogged ? 1 : healthLogged || studyLogged ? 0.5 : 0;

  await setDoc(doc(db, STREAK_COLLECTIONS.DAILY_SUMMARIES, docId), {
    userId,
    date,
    healthLogged,
    studyLogged,
    balanceScore,
    createdAt: serverTimestamp(),
  }, { merge: true });
};

// Get public snapshots for leaderboard (limited visibility)
export const getPublicSnapshots = async (limitCount: number = 10): Promise<PublicUserSnapshot[]> => {
  const q = query(
    collection(db, STREAK_COLLECTIONS.USER_STREAKS),
    orderBy('combinedScore', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data() as UserStreakRecord;
    return {
      userId: data.userId,
      displayName: data.displayName,
      dedicationLevel: data.dedicationLevel,
      currentStreak: Math.max(data.healthStreak, data.studyStreak),
      badge: getBadge(data.dedicationLevel),
    };
  });
};

// Subscribe to user streak
export const subscribeToUserStreak = (
  userId: string,
  callback: (streak: UserStreakRecord | null) => void
) => {
  return onSnapshot(
    doc(db, STREAK_COLLECTIONS.USER_STREAKS, userId),
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as UserStreakRecord);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.warn('Streak subscription error (using demo data):', error.message);
      callback(null);
    }
  );
};

// Subscribe to public leaderboard
export const subscribeToPublicLeaderboard = (
  callback: (snapshots: PublicUserSnapshot[]) => void,
  limitCount: number = 10
) => {
  const q = query(
    collection(db, STREAK_COLLECTIONS.USER_STREAKS),
    orderBy('combinedScore', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const snapshots = snapshot.docs.map(doc => {
        const data = doc.data() as UserStreakRecord;
        return {
          userId: data.userId,
          displayName: data.displayName,
          dedicationLevel: data.dedicationLevel,
          currentStreak: Math.max(data.healthStreak, data.studyStreak),
          badge: getBadge(data.dedicationLevel),
        };
      });
      callback(snapshots);
    },
    (error) => {
      console.warn('Leaderboard subscription error (using demo data):', error.message);
      callback([]);
    }
  );
};

// Get competitive feed
export const getCompetitiveFeed = async (): Promise<CompetitiveFeedItem[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's active users
  const activeQuery = query(
    collection(db, STREAK_COLLECTIONS.USER_STREAKS),
    where('lastActiveDate', '==', today)
  );
  const activeSnapshot = await getDocs(activeQuery);
  const activeUsers = activeSnapshot.docs.length;

  // Get top streak
  const topQuery = query(
    collection(db, STREAK_COLLECTIONS.USER_STREAKS),
    orderBy('combinedScore', 'desc'),
    limit(1)
  );
  const topSnapshot = await getDocs(topQuery);
  const topStreak = topSnapshot.docs[0]?.data()?.healthStreak || 0;

  // Build feed items
  const feedItems: CompetitiveFeedItem[] = [];

  if (activeUsers > 0) {
    feedItems.push({
      type: 'collective',
      message: `${activeUsers} student${activeUsers > 1 ? 's' : ''} logged progress today`,
      count: activeUsers,
      date: today,
      createdAt: Timestamp.now(),
    });
  }

  if (topStreak >= 3) {
    feedItems.push({
      type: 'top_streak',
      message: `Top consistency streak this week: ${topStreak} days`,
      count: topStreak,
      date: today,
      createdAt: Timestamp.now(),
    });
  }

  // Check for milestones
  const milestonesQuery = query(
    collection(db, STREAK_COLLECTIONS.USER_STREAKS),
    where('healthStreak', 'in', [7, 14, 21, 30])
  );
  const milestonesSnapshot = await getDocs(milestonesQuery);
  if (milestonesSnapshot.docs.length > 0) {
    feedItems.push({
      type: 'milestone',
      message: `${milestonesSnapshot.docs.length} student${milestonesSnapshot.docs.length > 1 ? 's' : ''} hit a milestone this week!`,
      count: milestonesSnapshot.docs.length,
      date: today,
      createdAt: Timestamp.now(),
    });
  }

  return feedItems;
};

// Subscribe to competitive feed
export const subscribeToCompetitiveFeed = (
  callback: (feed: CompetitiveFeedItem[]) => void
) => {
  // Poll every 30 seconds for feed updates
  const fetchFeed = async () => {
    try {
      const feed = await getCompetitiveFeed();
      callback(feed);
    } catch (error) {
      console.warn('Competitive feed error (using demo data):', error);
      callback([]);
    }
  };

  fetchFeed();
  const interval = setInterval(fetchFeed, 30000);

  return () => clearInterval(interval);
};

// Check if streak is at risk
export const isStreakAtRisk = (streak: UserStreakRecord): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Streak is at risk if not logged today and has an active streak
  const healthAtRisk = streak.healthStreak > 0 && streak.lastHealthLog !== today && streak.lastHealthLog === yesterdayStr;
  const studyAtRisk = streak.studyStreak > 0 && streak.lastStudyLog !== today && streak.lastStudyLog === yesterdayStr;

  return healthAtRisk || studyAtRisk;
};

// Get aggregate stats for AI prompts
export const getAggregateStats = async (): Promise<{
  activeUsers: number;
  topStreak: number;
  avgConsistency: number;
}> => {
  const today = new Date().toISOString().split('T')[0];

  const activeQuery = query(
    collection(db, STREAK_COLLECTIONS.USER_STREAKS),
    where('lastActiveDate', '==', today)
  );
  const activeSnapshot = await getDocs(activeQuery);

  const allQuery = query(collection(db, STREAK_COLLECTIONS.USER_STREAKS));
  const allSnapshot = await getDocs(allQuery);

  let topStreak = 0;
  let totalConsistency = 0;

  allSnapshot.docs.forEach(doc => {
    const data = doc.data() as UserStreakRecord;
    const maxStreak = Math.max(data.healthStreak, data.studyStreak);
    if (maxStreak > topStreak) topStreak = maxStreak;
    totalConsistency += data.combinedScore;
  });

  return {
    activeUsers: activeSnapshot.docs.length,
    topStreak,
    avgConsistency: allSnapshot.docs.length > 0 ? totalConsistency / allSnapshot.docs.length : 0,
  };
};
