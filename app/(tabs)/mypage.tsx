import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { getStats, getStreak, StatsResult } from '@/services/sessionService';

export default function MyPageScreen() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([getStats(user.id), getStreak(user.id)])
      .then(([s, str]) => {
        setStats(s);
        setStreak(str);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>ログインして学習履歴を確認しましょう</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>マイページ</Text>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streak}日連続</Text>
            </View>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4A90D9" style={{ marginTop: 40 }} />
        ) : stats ? (
          <>
            {/* Overall stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalQuestions}</Text>
                <Text style={styles.statLabel}>総回答数</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#27AE60' }]}>{stats.accuracy}%</Text>
                <Text style={styles.statLabel}>正答率</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.correctCount}</Text>
                <Text style={styles.statLabel}>正解数</Text>
              </View>
            </View>

            {/* Weak areas */}
            {stats.byCategory.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>分野別 正答率</Text>
                {stats.byCategory
                  .sort((a, b) => a.accuracy - b.accuracy)
                  .map((cat) => (
                    <View key={cat.category} style={styles.categoryRow}>
                      <Text style={styles.categoryName} numberOfLines={1}>
                        {cat.category}
                      </Text>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            { width: `${cat.accuracy}%` as any },
                            cat.accuracy < 50 && styles.barWeak,
                            cat.accuracy >= 80 && styles.barStrong,
                          ]}
                        />
                      </View>
                      <Text style={styles.categoryAccuracy}>{cat.accuracy}%</Text>
                    </View>
                  ))}
              </View>
            )}

            {stats.totalQuestions === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>まだ学習履歴がありません。</Text>
                <Text style={styles.emptyText}>ホームから資格を選んで始めましょう！</Text>
              </View>
            )}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '800', color: '#2C3E50' },
  streakBadge: {
    backgroundColor: '#FFF3CD',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#F39C12',
  },
  streakText: { fontSize: 13, fontWeight: '700', color: '#E67E22' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: { fontSize: 28, fontWeight: '800', color: '#4A90D9' },
  statLabel: { fontSize: 11, color: '#7F8C8D', marginTop: 2 },
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
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#2C3E50' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryName: { width: 80, fontSize: 12, color: '#2C3E50' },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F3FA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4A90D9',
    borderRadius: 4,
  },
  barWeak: { backgroundColor: '#E74C3C' },
  barStrong: { backgroundColor: '#27AE60' },
  categoryAccuracy: { width: 36, fontSize: 12, fontWeight: '600', color: '#2C3E50', textAlign: 'right' },
  empty: { alignItems: 'center', marginTop: 40, gap: 8 },
  emptyText: { fontSize: 14, color: '#7F8C8D', textAlign: 'center' },
});
