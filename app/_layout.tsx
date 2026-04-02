import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';
import { getNotificationSettings, scheduleStudyReminder } from '@/services/notificationService';
import { ONBOARDING_DONE_KEY } from './onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';

// RevenueCat — dynamically imported to avoid crash when package is not installed
let Purchases: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Purchases = require('react-native-purchases').default;
} catch {
  // Package not installed yet — skip initialization
}

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

export default function RootLayout() {
  const { setSession, setProfile, setLoading, setIsPro } = useAuthStore();

  useEffect(() => {
    // オンボーディング初回チェック
    AsyncStorage.getItem(ONBOARDING_DONE_KEY).then((done) => {
      if (!done) router.replace('/onboarding');
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadProfile(session.user.id);
        initRevenueCat(session.user.id);
      }
      setLoading(false);
    }).catch(() => {
      // Supabase not configured yet (demo mode)
      setLoading(false);
    });

    // 通知が設定済みの場合は再スケジュール（アプリ再起動時）
    getNotificationSettings().then(({ enabled, hour, minute }) => {
      if (enabled) scheduleStudyReminder(hour, minute).catch(() => {});
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadProfile(session.user.id);
        initRevenueCat(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data) setProfile(data);
    } catch {
      // ignore
    }
  };

  const initRevenueCat = async (userId: string) => {
    if (!Purchases) return;
    try {
      const { Platform } = require('react-native');
      const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
      if (!apiKey) return;
      await Purchases.configure({ apiKey, appUserID: userId });
      const customerInfo = await Purchases.getCustomerInfo();
      const isPro = typeof customerInfo.entitlements.active['pro'] !== 'undefined';
      setIsPro(isPro);
    } catch {
      // RevenueCat not configured — skip
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="session" />
      <Stack.Screen name="qualification" />
      <Stack.Screen name="aptitude" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
