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
  onSnapshot,
  addDoc,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  HEALTH_DATA: 'healthData',
  WEEKLY_TRENDS: 'weeklyTrends',
  INSIGHTS: 'insights',
} as const;

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  examMode: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HealthDataDoc {
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

export interface WeeklyTrendDoc {
  userId: string;
  day: string;
  sleep: number;
  steps: number;
  score: number;
  date: string;
  createdAt: Timestamp;
}

// Generic CRUD Operations

// Create a document with auto-generated ID
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Create a document with custom ID
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge: boolean = false
): Promise<void> => {
  await setDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge });
};

// Read a single document
export const getDocument = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const docSnap = await getDoc(doc(db, collectionName, docId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

// Read multiple documents with optional query constraints
export const getDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

// Update a document
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> => {
  await updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Delete a document
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, docId));
};

// Real-time listener for a single document
export const subscribeToDocument = <T>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
) => {
  return onSnapshot(doc(db, collectionName, docId), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
};

// Real-time listener for a collection
export const subscribeToCollection = <T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
) => {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(data);
  });
};

// User-specific operations

// Create or update user profile
export const saveUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  await setDocument(COLLECTIONS.USERS, uid, data, true);
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  return getDocument<UserProfile>(COLLECTIONS.USERS, uid);
};

// Save health data
export const saveHealthData = async (
  userId: string,
  data: Omit<HealthDataDoc, 'userId' | 'createdAt'>
): Promise<string> => {
  return createDocument(COLLECTIONS.HEALTH_DATA, {
    userId,
    ...data,
  });
};

// Get health data for a user
export const getHealthData = async (
  userId: string,
  dateLimit?: number
): Promise<HealthDataDoc[]> => {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('date', 'desc'),
  ];
  
  if (dateLimit) {
    constraints.push(limit(dateLimit));
  }
  
  return getDocuments<HealthDataDoc>(COLLECTIONS.HEALTH_DATA, constraints);
};

// Get weekly trends for a user
export const getWeeklyTrends = async (userId: string): Promise<WeeklyTrendDoc[]> => {
  return getDocuments<WeeklyTrendDoc>(COLLECTIONS.WEEKLY_TRENDS, [
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(7),
  ]);
};

// Subscribe to user's health data
export const subscribeToHealthData = (
  userId: string,
  callback: (data: HealthDataDoc[]) => void
) => {
  return subscribeToCollection<HealthDataDoc>(
    COLLECTIONS.HEALTH_DATA,
    [where('userId', '==', userId), orderBy('date', 'desc'), limit(30)],
    callback
  );
};

// Export query helpers
export { where, orderBy, limit, serverTimestamp };
