import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update display name if provided
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  
  return userCredential;
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, googleProvider);
};

// Sign in with GitHub
export const signInWithGithub = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, githubProvider);
};

// Sign out
export const logOut = async (): Promise<void> => {
  return signOut(auth);
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// Update user profile
export const updateUserProfile = async (
  user: User,
  data: { displayName?: string; photoURL?: string }
): Promise<void> => {
  return updateProfile(user, data);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Export auth instance for direct access if needed
export { auth };
