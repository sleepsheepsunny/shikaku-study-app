import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_DONE_KEY = 'onboarding_done';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🤖',
    title: 'AIが無限に問題を生成',
    description: '16種類の人気資格・検定に対応。\nAIが毎回新しい問題を作るので、\n繰り返し学習しても飽きません。',
  },
  {
    emoji: '📊',
    title: '弱点分野を自動分析',
    description: '解答データをもとに分野別の正答率を表示。\n苦手な分野を集中的に学習して、\n効率よく合格を目指せます。',
  },
  {
    emoji: '🎯',
    title: 'まずは無料で始める',
    description: '無料プランで毎日10問学習できます。\nより多く学習したい方は\nプロプラン（月額¥490）へアップグレード。',
  },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const slide = SLIDES[page];
  const isLast = page === SLIDES.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');
      router.replace('/auth/login');
    } else {
      setPage(page + 1);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Skip */}
        {!isLast && (
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>スキップ</Text>
          </TouchableOpacity>
        )}

        {/* Slide content */}
        <View style={styles.slideArea}>
          <Text style={styles.emoji}>{slide.emoji}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'ログイン / 新規登録' : '次へ'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  container: { flex: 1, paddingHorizontal: 32, paddingBottom: 40, paddingTop: 16 },
  skipBtn: { alignSelf: 'flex-end', padding: 8 },
  skipText: { fontSize: 14, color: '#7F8C8D' },
  slideArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  emoji: { fontSize: 80 },
  title: { fontSize: 24, fontWeight: '800', color: '#2C3E50', textAlign: 'center' },
  description: { fontSize: 15, color: '#7F8C8D', textAlign: 'center', lineHeight: 26 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDE3EE',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#4A90D9',
  },
  nextBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4A90D9',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  nextBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
