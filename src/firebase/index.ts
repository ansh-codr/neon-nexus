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

// Type exports
export type {
  UserProfile,
  HealthDataDoc,
  WeeklyTrendDoc,
} from './firestore';
