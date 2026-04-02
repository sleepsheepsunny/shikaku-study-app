import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useSessionStore } from '@/stores/sessionStore';
import { useAuthStore } from '@/stores/authStore';
import { completeSession } from '@/services/sessionService';

export default function ResultScreen() {
  const { answers, sessionId, qualificationSlug, score, resetSession } = useSessionStore();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const { correct, total, accuracy } = score();

  const isDemo = sessionId === 'demo-session';

  useEffect(() => {
    if (!isDemo && sessionId && user) {
      completeSession(sessionId, answers).catch(console.error);
    }
  }, []);

  const handleHome = () => {
    resetSession();
    router.replace('/');
  };

  const handleRetry = () => {
    resetSession();
    router.replace({ pathname: '/session/setup', params: { slug: qualificationSlug! } });
  };

  const getResultEmoji = () => {
    if (accuracy >= 90) return '🎉';
    if (accuracy >= 70) return '😊';
    if (accuracy >= 50) return '😐';
    return '😤';
  };

  const getResultMessage = () => {
    if (accuracy >= 90) return '素晴らしい！';
    if (accuracy >= 70) return 'よくできました！';
    if (accuracy >= 50) return 'もう少しです！';
    return '復習しましょう！';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.emoji}>{getResultEmoji()}</Text>
          <Text style={styles.message}>{getResultMessage()}</Text>
          <Text style={styles.accuracy}>{accuracy}%</Text>
          <Text style={styles.scoreDetail}>
            {correct} / {total} 問正解
          </Text>
        </View>

        {/* Review wrong answers */}
        {answers.filter((a) => !a.isCorrect).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>間違えた問題</Text>
            {answers
              .filter((a) => !a.isCorrect)
              .map((a, i) => (
                <View key={i} style={styles.wrongItem}>
                  <Text style={styles.wrongQ} numberOfLines={2}>
                    {a.question.question_text}
                  </Text>
                  <Text style={styles.wrongExplanation}>
                    {(a.question.question_data as any).explanation}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {/* Pro upsell — 非Proユーザーに表示 */}
        {!profile?.is_pro && (
          <TouchableOpacity
            style={styles.proCard}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Text style={styles.proCardTitle}>もっと学習したいなら Pro へ</Text>
            <Text style={styles.proCardSub}>無制限で全資格を学習 · 月額¥490</Text>
            <View style={styles.proCardBtn}>
              <Text style={styles.proCardBtnText}>プロプランを見る →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Actions */}
        <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
          <Text style={styles.retryText}>もう一度挑戦する</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={handleHome}>
          <Text style={styles.homeText}>ホームに戻る</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  emoji: { fontSize: 60 },
  message: { fontSize: 20, fontWeight: '700', color: '#2C3E50' },
  accuracy: { fontSize: 64, fontWeight: '900', color: '#4A90D9' },
  scoreDetail: { fontSize: 16, color: '#7F8C8D' },
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
  wrongItem: {
    gap: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3FA',
  },
  wrongQ: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
  wrongExplanation: { fontSize: 13, color: '#7F8C8D', lineHeight: 20 },
  retryBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  retryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  homeBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
  },
  homeText: { color: '#7F8C8D', fontSize: 16, fontWeight: '700' },
  proCard: {
    backgroundColor: '#FFF8EC',
    borderRadius: 14,
    padding: 16,
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#F39C12',
    alignItems: 'center',
  },
  proCardTitle: { fontSize: 15, fontWeight: '800', color: '#2C3E50' },
  proCardSub: { fontSize: 13, color: '#7F8C8D' },
  proCardBtn: {
    marginTop: 4,
    backgroundColor: '#F39C12',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  proCardBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
