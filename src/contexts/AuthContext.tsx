import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, logOut, getUserProfile, saveUserProfile, signUpWithEmail, signInWithEmail } from '../firebase';
import type { UserProfile } from '../firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setExamMode: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          // Fetch or create user profile
          let profile = await getUserProfile(authUser.uid);
          
          if (!profile) {
            // Create initial profile
            const newProfile: Partial<UserProfile> = {
              uid: authUser.uid,
              email: authUser.email || '',
              displayName: authUser.displayName || 'Cyber User',
              photoURL: authUser.photoURL || undefined,
              examMode: false,
            };
            try {
              await saveUserProfile(authUser.uid, newProfile);
              profile = await getUserProfile(authUser.uid);
            } catch (saveErr) {
              console.warn('Could not save profile to Firebase, using local:', saveErr);
              profile = newProfile as UserProfile;
            }
          }
          
          setUserProfile(profile);
        } catch (err) {
          console.warn('Error fetching user profile, using defaults:', err);
          // Use default profile based on auth user data
          setUserProfile({
            uid: authUser.uid,
            email: authUser.email || '',
            displayName: authUser.displayName || 'Cyber User',
            photoURL: authUser.photoURL || undefined,
            examMode: false,
          } as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await logOut();
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No authenticated user');
    
    try {
      await saveUserProfile(user.uid, data);
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  const setExamMode = async (enabled: boolean) => {
    await updateProfile({ examMode: enabled });
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    try {
      await signUpWithEmail(email, password, displayName);
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    logout,
    login,
    signup,
    updateProfile,
    setExamMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
