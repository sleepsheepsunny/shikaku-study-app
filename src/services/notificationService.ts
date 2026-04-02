import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_HOUR_KEY = 'notification_hour';
const NOTIFICATION_MINUTE_KEY = 'notification_minute';
const NOTIFICATION_ENABLED_KEY = 'notification_enabled';
const NOTIFICATION_ID_KEY = 'notification_id';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleStudyReminder(hour: number, minute: number): Promise<void> {
  // 既存の通知をキャンセル
  await cancelStudyReminder();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '資格マスター',
      body: '今日の学習はお済みですか？',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  await AsyncStorage.setItem(NOTIFICATION_ID_KEY, id);
  await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
  await AsyncStorage.setItem(NOTIFICATION_HOUR_KEY, String(hour));
  await AsyncStorage.setItem(NOTIFICATION_MINUTE_KEY, String(minute));
}

export async function cancelStudyReminder(): Promise<void> {
  const id = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
  }
  await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'false');
}

export async function getNotificationSettings(): Promise<{
  enabled: boolean;
  hour: number;
  minute: number;
}> {
  const [enabled, hour, minute] = await Promise.all([
    AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY),
    AsyncStorage.getItem(NOTIFICATION_HOUR_KEY),
    AsyncStorage.getItem(NOTIFICATION_MINUTE_KEY),
  ]);

  return {
    enabled: enabled === 'true',
    hour: hour !== null ? parseInt(hour, 10) : 21,
    minute: minute !== null ? parseInt(minute, 10) : 0,
  };
}
