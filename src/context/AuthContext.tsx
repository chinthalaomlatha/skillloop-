import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../types';
import { store } from '../lib/store';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, fullName: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => void;
  switchActiveUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(store.getState().currentUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial user from store or Supabase
    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (profile) {
              setUser(profile);
              store.setCurrentUser(profile);
            }
          }
        } catch (err) {
          console.warn('Supabase session fetch issue, falling back to local session:', err);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const unsubscribe = store.subscribe((state) => {
      setUser(state.currentUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (profile) {
            setUser(profile);
            store.setCurrentUser(profile);
          }
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Supabase authentication failed.' };
      }
    }

    // Local authentication lookup / fallback
    const state = store.getState();
    const existing = state.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      store.setCurrentUser(existing);
      setUser(existing);
      setIsLoading(false);
      return { success: true };
    }

    // If new user email without password failure, create profile
    const newProfile = store.registerUser(email, email.split('@')[0]);
    setUser(newProfile);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (email: string, fullName: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Supabase signup failed.' };
      }
    }

    const newProfile = store.registerUser(email, fullName);
    setUser(newProfile);
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    store.setCurrentUser(null);
    setUser(null);
  };

  const updateProfile = (data: Partial<Profile>) => {
    store.updateProfile(data);
  };

  const switchActiveUser = (userId: string) => {
    const target = store.getState().profiles.find((p) => p.id === userId);
    if (target) {
      store.setCurrentUser(target);
      setUser(target);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        switchActiveUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
