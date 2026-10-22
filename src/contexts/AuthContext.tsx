import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  class_id: string | null;
  date_of_birth: string | null;
  gender: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  school_name: string | null;
  board: string | null;
}

export interface SignUpData {
  fullName: string;
  phone: string;
  classId?: string;
  dateOfBirth?: string;
  gender?: string;
  parentName?: string;
  parentPhone?: string;
  schoolName?: string;
  board?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, data: SignUpData) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setProfile(data);
      return data;
    }

    // Safe recovery: if profile row is missing for an authenticated user,
    // invoke the ensure_profile RPC to recover profile data safely and idempotently.
    if (!error && !data) {
      try {
        const { data: recovered, error: rpcError } = await (supabase.rpc as any)('ensure_profile');
        if (!rpcError && recovered) {
          setProfile(recovered as Profile);
          return recovered as Profile;
        }
      } catch (err) {
        console.warn('Profile recovery attempt failed:', err);
      }
    }

    return null;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to prevent potential deadlock
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, data: SignUpData) => {
    const metadata = {
      full_name: data.fullName.trim(),
      phone: data.phone?.trim() || null,
      class_id: data.classId?.trim() || null,
      date_of_birth: data.dateOfBirth?.trim() || null,
      gender: data.gender?.trim() || null,
      parent_name: data.parentName?.trim() || null,
      parent_phone: data.parentPhone?.trim() || null,
      school_name: data.schoolName?.trim() || null,
      board: data.board?.trim() || 'CBSE',
      address: data.address?.trim() || null,
      city: data.city?.trim() || null,
      state: data.state?.trim() || 'Madhya Pradesh',
      pincode: data.pincode?.trim() || null,
    };

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: metadata,
      },
    });

    if (error) {
      return { error: error as Error };
    }

    // If an authenticated session is immediately active (e.g. email confirmation disabled),
    // fetch the created profile into state. Profile creation is handled atomically by
    // the database trigger, eliminating reliance on client-side writes.
    if (authData?.session?.user) {
      await fetchProfile(authData.session.user.id);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (!error) {
      await fetchProfile(user.id);
    }
    
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
