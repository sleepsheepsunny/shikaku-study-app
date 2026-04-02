import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Linking, ActivityIndicator, Switch } from 'react-native';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import {
  requestNotificationPermission,
  scheduleStudyReminder,
  cancelStudyReminder,
  getNotificationSettings,
} from '@/services/notificationService';

let Purchases: any = null;
try {
  Purchases = require('react-native-purchases').default;
} catch {
  // Package not installed yet
}

export default function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const setIsPro = useAuthStore((s) => s.setIsPro);
  const [purchasing, setPurchasing] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifHour, setNotifHour] = useState(21);

  useEffect(() => {
    getNotificationSettings().then(({ enabled, hour }) => {
      setNotifEnabled(enabled);
      setNotifHour(hour);
    });
  }, []);

  const handleToggleNotification = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('通知が許可されていません', '設定アプリから通知を許可してください。');
        return;
      }
      await scheduleStudyReminder(notifHour, 0);
    } else {
      await cancelStudyReminder();
    }
    setNotifEnabled(value);
  };

  const handleChangeHour = async (delta: number) => {
    const newHour = (notifHour + delta + 24) % 24;
    setNotifHour(newHour);
    if (notifEnabled) {
      await scheduleStudyReminder(newHour, 0);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  const handlePurchase = async () => {
    if (!Purchases) {
      Alert.alert('準備中', '課金機能は近日公開予定です。');
      return;
    }
    setPurchasing(true);
    try {
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages?.[0];
      if (!pkg) {
        Alert.alert('エラー', '購入プランが見つかりませんでした。');
        return;
      }
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const isPro = typeof customerInfo.entitlements.active['pro'] !== 'undefined';
      setIsPro(isPro);
      if (isPro) Alert.alert('購入完了', 'プロプランへようこそ！');
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('購入エラー', e.message ?? '購入に失敗しました。');
      }
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>設定</Text>

        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>アカウント</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>メールアドレス</Text>
              <Text style={styles.rowValue}>{user.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>プラン</Text>
              <Text style={[styles.rowValue, profile?.is_pro && styles.proPlan]}>
                {profile?.is_pro ? 'Pro' : '無料（10問/日）'}
              </Text>
            </View>
          </View>
        )}

        {!profile?.is_pro && (
          <TouchableOpacity
            style={[styles.upgradeBtn, purchasing && styles.upgradeBtnDisabled]}
            onPress={handlePurchase}
            disabled={purchasing}
          >
            {purchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.upgradeBtnText}>プロプランにアップグレード</Text>
                <Text style={styles.upgradeBtnSub}>月額¥490 · 無制限で全資格が使えます</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {profile?.is_pro && (
          <TouchableOpacity
            style={styles.manageSubBtn}
            onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')}
          >
            <Text style={styles.manageSubText}>サブスクリプションを管理</Text>
            <Text style={styles.manageSubHint}>解約: 設定アプリ → Apple ID → サブスクリプション</Text>
          </TouchableOpacity>
        )}

        {/* 通知設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学習リマインダー</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>毎日通知</Text>
            <Switch
              value={notifEnabled}
              onValueChange={handleToggleNotification}
              trackColor={{ true: '#4A90D9' }}
            />
          </View>
          {notifEnabled && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>通知時刻</Text>
              <View style={styles.hourPicker}>
                <TouchableOpacity onPress={() => handleChangeHour(-1)} style={styles.hourBtn}>
                  <Text style={styles.hourBtnText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.hourValue}>{String(notifHour).padStart(2, '0')}:00</Text>
                <TouchableOpacity onPress={() => handleChangeHour(1)} style={styles.hourBtn}>
                  <Text style={styles.hourBtnText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>このアプリについて</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>問題について</Text>
            <Text style={styles.rowValue}>AIが生成した練習問題です</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>バージョン</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>

        {user ? (
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() =>
              Alert.alert('ログアウト', 'ログアウトしますか？', [
                { text: 'キャンセル', style: 'cancel' },
                { text: 'ログアウト', style: 'destructive', onPress: handleLogout },
              ])
            }
          >
            <Text style={styles.logoutText}>ログアウト</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginText}>ログイン / 新規登録</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { flex: 1, padding: 16, gap: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#2C3E50' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#7F8C8D' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 14, color: '#2C3E50' },
  rowValue: { fontSize: 14, color: '#7F8C8D', maxWidth: '55%', textAlign: 'right' },
  proPlan: { color: '#F39C12', fontWeight: '700' },
  upgradeBtn: {
    backgroundColor: '#F39C12',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    gap: 4,
  },
  upgradeBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  upgradeBtnSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  upgradeBtnDisabled: { opacity: 0.7 },
  manageSubBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE3EE',
    gap: 4,
  },
  manageSubText: { color: '#2C3E50', fontWeight: '700', fontSize: 14 },
  manageSubHint: { color: '#95A5A6', fontSize: 11 },
  logoutBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  logoutText: { color: '#E74C3C', fontWeight: '700', fontSize: 15 },
  loginBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  loginText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  hourPicker: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hourBtn: { padding: 8 },
  hourBtnText: { fontSize: 22, color: '#4A90D9', fontWeight: '700' },
  hourValue: { fontSize: 18, fontWeight: '700', color: '#2C3E50', minWidth: 56, textAlign: 'center' },
});
