import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
export const ADMIN_COLLECTIONS = {
  MOCK_USERS: 'mockUsers',
  MOCK_HEALTH_DATA: 'mockHealthData',
} as const;

// Types
export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Timestamp;
}

export interface MockHealthData {
  id: string;
  userId: string;
  sleepHours: number;
  steps: number;
  activityLevel: 'low' | 'medium' | 'high';
  focusLevel: 'low' | 'medium' | 'high';
  stressLevel: 'low' | 'medium' | 'high';
  healthScore: number;
  date: string;
  createdAt: Timestamp;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  avgScore: number;
  totalScore: number;
  dataCount: number;
  streak?: number;
}

// Calculate health score
const calculateHealthScore = (data: {
  sleepHours: number;
  activityLevel: 'low' | 'medium' | 'high';
  focusLevel: 'low' | 'medium' | 'high';
  stressLevel: 'low' | 'medium' | 'high';
}): number => {
  let score = 50;

  // Sleep contribution (0-30 points)
  if (data.sleepHours >= 7 && data.sleepHours <= 9) {
    score += 30;
  } else if (data.sleepHours >= 6 && data.sleepHours < 7) {
    score += 20;
  } else if (data.sleepHours >= 5 && data.sleepHours < 6) {
    score += 10;
  }

  // Activity contribution (0-20 points)
  if (data.activityLevel === 'high') score += 20;
  else if (data.activityLevel === 'medium') score += 12;
  else if (data.activityLevel === 'low') score += 5;

  // Focus contribution (0-15 points)
  if (data.focusLevel === 'high') score += 15;
  else if (data.focusLevel === 'medium') score += 10;
  else if (data.focusLevel === 'low') score += 3;

  // Stress penalty (-15 to 0 points)
  if (data.stressLevel === 'high') score -= 15;
  else if (data.stressLevel === 'medium') score -= 5;

  return Math.min(100, Math.max(0, score));
};

// Get all mock users
export const getAllUsers = async (): Promise<MockUser[]> => {
  const querySnapshot = await getDocs(collection(db, ADMIN_COLLECTIONS.MOCK_USERS));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MockUser));
};

// Get all health data
export const getAllHealthData = async (): Promise<MockHealthData[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, ADMIN_COLLECTIONS.MOCK_HEALTH_DATA), orderBy('createdAt', 'desc'))
  );
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MockHealthData));
};

// Create mock user
export const createMockUser = async (data: { name: string; email: string; avatar?: string }): Promise<string> => {
  const docRef = await addDoc(collection(db, ADMIN_COLLECTIONS.MOCK_USERS), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update mock user
export const updateMockUser = async (userId: string, data: Partial<MockUser>): Promise<void> => {
  await updateDoc(doc(db, ADMIN_COLLECTIONS.MOCK_USERS, userId), data);
};

// Delete mock user
export const deleteMockUser = async (userId: string): Promise<void> => {
  // Delete user
  await deleteDoc(doc(db, ADMIN_COLLECTIONS.MOCK_USERS, userId));
  
  // Delete user's health data
  const healthDataQuery = query(
    collection(db, ADMIN_COLLECTIONS.MOCK_HEALTH_DATA),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(healthDataQuery);
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

// Create mock health data
export const createMockHealthData = async (
  userId: string,
  data: {
    sleepHours: number;
    steps: number;
    activityLevel: 'low' | 'medium' | 'high';
    focusLevel: 'low' | 'medium' | 'high';
    stressLevel: 'low' | 'medium' | 'high';
  }
): Promise<string> => {
  const healthScore = calculateHealthScore(data);
  const today = new Date().toISOString().split('T')[0];

  const docRef = await addDoc(collection(db, ADMIN_COLLECTIONS.MOCK_HEALTH_DATA), {
    userId,
    ...data,
    healthScore,
    date: today,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Get leaderboard
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Get all mock users
  const users = await getAllUsers();
  
  // Get all health data
  const healthData = await getAllHealthData();

  // Calculate average scores per user
  const userScores = new Map<string, { total: number; count: number; name: string; avatar?: string }>();

  // Initialize with users
  users.forEach(user => {
    userScores.set(user.id, { total: 0, count: 0, name: user.name, avatar: user.avatar });
  });

  // Add health data
  healthData.forEach(data => {
    const existing = userScores.get(data.userId);
    if (existing) {
      existing.total += data.healthScore;
      existing.count += 1;
    }
  });

  // Convert to leaderboard entries
  const leaderboard: LeaderboardEntry[] = [];
  userScores.forEach((value, userId) => {
    if (value.count > 0) {
      leaderboard.push({
        userId,
        name: value.name,
        avatar: value.avatar,
        avgScore: value.total / value.count,
        totalScore: value.total,
        dataCount: value.count,
      });
    }
  });

  // Sort by average score
  leaderboard.sort((a, b) => b.avgScore - a.avgScore);

  return leaderboard;
};

// Subscribe to leaderboard changes (real-time)
export const subscribeToLeaderboard = (callback: (data: LeaderboardEntry[]) => void) => {
  // This is a simplified version - for full real-time, you'd need composite subscriptions
  const fetchLeaderboard = async () => {
    const data = await getLeaderboard();
    callback(data);
  };

  fetchLeaderboard();
  
  // Poll every 30 seconds for updates (simpler than complex real-time setup)
  const interval = setInterval(fetchLeaderboard, 30000);
  
  return () => clearInterval(interval);
};

// Initialize mock data with predefined users
export const initializeMockData = async (): Promise<void> => {
  const mockUsers = [
    { name: 'Adarsh', email: 'adarsh@campus.edu' },
    { name: 'Ayush', email: 'ayush@campus.edu' },
    { name: 'Brajesh', email: 'brajesh@campus.edu' },
    { name: 'Priya', email: 'priya@campus.edu' },
    { name: 'Sachin', email: 'sachin@campus.edu' },
    { name: 'Tanwar', email: 'tanwar@campus.edu' },
  ];

  // Check if users already exist
  const existingUsers = await getAllUsers();
  if (existingUsers.length >= 6) {
    console.log('Mock users already exist');
    return;
  }

  // Create users
  for (const user of mockUsers) {
    const userId = await createMockUser(user);
    
    // Generate random health data for each user
    const randomData = {
      sleepHours: Math.floor(Math.random() * 4) + 5, // 5-8 hours
      steps: Math.floor(Math.random() * 8000) + 2000, // 2000-10000 steps
      activityLevel: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
      focusLevel: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
      stressLevel: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
    };
    
    await createMockHealthData(userId, randomData);
  }

  console.log('Mock data initialized successfully');
};
