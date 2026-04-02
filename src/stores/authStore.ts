import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  display_name: string | null;
  is_pro: boolean;
  daily_q_count: number;
  daily_q_reset: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setIsPro: (isPro: boolean) => void;
  canGenerateQuestion: () => boolean;
  dailyLimit: number;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  dailyLimit: 10,

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  setProfile: (profile) => set({ profile }),

  setLoading: (isLoading) => set({ isLoading }),

  setIsPro: (isPro) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, is_pro: isPro } : state.profile,
    })),

  canGenerateQuestion: () => {
    const { profile } = get();
    if (!profile) return false;
    if (profile.is_pro) return true;
    const today = new Date().toISOString().split('T')[0];
    if (profile.daily_q_reset !== today) return true; // reset day
    return profile.daily_q_count < get().dailyLimit;
  },
}));
