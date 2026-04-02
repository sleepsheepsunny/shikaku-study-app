import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getQualificationConfig, QualificationConfig } from '@/config/qualifications';
import { QuestionUIType } from '@/types/question';
import { useSessionStore } from '@/stores/sessionStore';
import { useAuthStore } from '@/stores/authStore';
import { fetchQuestions } from '@/services/questionService';
import { createSession, getQualificationId } from '@/services/sessionService';
import { supabase } from '@/services/supabase';

const QUESTION_COUNTS = [5, 10, 15, 20];

function buildCustomConfig(row: any): QualificationConfig {
  const uiTypes: QuestionUIType[] = (row.ui_types ?? ['multiple_choice']) as QuestionUIType[];
  const rawCategories: string[] = Array.isArray(row.categories) ? row.categories : ['一般'];
  return {
    slug: row.slug,
    name: row.name,
    nameShort: row.name_short ?? row.name.slice(0, 10),
    genre: row.genre ?? 'it',
    defaultUITypes: uiTypes,
    categories: rawCategories.map((cat) => ({ id: cat, label: cat, uiTypes })),
    systemPrompt: row.system_prompt ?? '',
    promptGuidelines: '',
    description: row.description ?? '',
  };
}

export default function SetupScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const isCustom = slug?.startsWith('custom-') ?? false;

  const [config, setConfig] = useState<QualificationConfig | null>(() => {
    if (isCustom) return null;
    try {
      return getQualificationConfig(slug!);
    } catch {
      return null;
    }
  });
  const [configLoading, setConfigLoading] = useState(isCustom);

  const [category, setCategory] = useState('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const setupSession = useSessionStore((s) => s.setupSession);
  const startSession = useSessionStore((s) => s.startSession);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const canGenerate = useAuthStore((s) => s.canGenerateQuestion)();

  // カスタム資格の場合はDBから設定を取得
  useEffect(() => {
    if (!isCustom) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('qualifications')
          .select('*')
          .eq('slug', slug!)
          .single();
        if (error || !data) {
          setErrorMsg('資格情報の取得に失敗しました。');
        } else {
          const cfg = buildCustomConfig(data);
          setConfig(cfg);
          setCategory(cfg.categories[0]?.id ?? '');
        }
      } finally {
        setConfigLoading(false);
      }
    })();
  }, [slug, isCustom]);

  // ローカル資格の初期カテゴリ設定
  useEffect(() => {
    if (!isCustom && config && !category) {
      setCategory(config.categories[0].id);
    }
  }, [config]);

  const handleStart = async () => {
    setErrorMsg(null);

    if (!user) {
      setErrorMsg('ログインが必要です。設定タブからログインしてください。');
      return;
    }
    if (!canGenerate) {
      setErrorMsg('今日の上限（10問）に達しました。プロプランなら無制限で学習できます。');
      return;
    }
    if (!config) return;

    const selectedCategory = config.categories.find((c) => c.id === category);
    if (!selectedCategory) return;
    const uiType: QuestionUIType = selectedCategory.uiTypes[0];

    setLoading(true);
    try {
      const qualificationId = await getQualificationId(slug!);

      setupSession({
        qualificationSlug: slug!,
        qualificationId,
        category,
        questionCount: count,
      });

      const questions = await fetchQuestions({
        qualificationSlug: slug!,
        qualificationId,
        category,
        count,
        uiType,
        userId: user.id,
      });

      const sessionId = await createSession({
        userId: user.id,
        qualificationId,
        category,
        totalQuestions: count,
      });

      startSession(questions, sessionId);
      router.push('/session/question');
    } catch (e: any) {
      console.error('[Setup] Error:', e);
      setErrorMsg(e.message ?? '問題の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  if (configLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90D9" />
          <Text style={styles.loadingNote}>資格情報を読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!config) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>資格情報の取得に失敗しました。</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ 戻る</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ 戻る</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.qualName}>{config.name}</Text>
            <Text style={styles.qualGenre}>{config.nameShort}</Text>
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>分野</Text>
          <View style={styles.chipGrid}>
            {config.categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, category === cat.id && styles.chipActive]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={[styles.chipText, category === cat.id && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Question count */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>問題数</Text>
          <View style={styles.countRow}>
            {QUESTION_COUNTS.map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.countBtn, count === n && styles.countBtnActive]}
                onPress={() => setCount(n)}
              >
                <Text style={[styles.countText, count === n && styles.countTextActive]}>{n}問</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTextMsg}>{errorMsg}</Text>
            {!canGenerate && !profile?.is_pro && (
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => router.push('/(tabs)/settings')}
              >
                <Text style={styles.upgradeBtnText}>プロプランを見る →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.startBtn, loading && styles.startBtnDisabled]}
          onPress={handleStart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.startBtnText}>問題を始める →</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingNote}>AIが問題を生成中です…（初回は10秒ほどかかります）</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: 16, gap: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  header: { gap: 4 },
  backBtn: { marginBottom: 4 },
  backText: { fontSize: 16, color: '#4A90D9' },
  qualName: { fontSize: 22, fontWeight: '800', color: '#2C3E50' },
  qualGenre: { fontSize: 13, color: '#7F8C8D' },
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
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#7F8C8D' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    backgroundColor: '#FAFBFE',
  },
  chipActive: { borderColor: '#4A90D9', backgroundColor: '#EBF4FF' },
  chipText: { fontSize: 13, color: '#7F8C8D' },
  chipTextActive: { color: '#4A90D9', fontWeight: '700' },
  countRow: { flexDirection: 'row', gap: 10 },
  countBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    backgroundColor: '#FAFBFE',
  },
  countBtnActive: { borderColor: '#4A90D9', backgroundColor: '#EBF4FF' },
  countText: { fontSize: 15, fontWeight: '600', color: '#7F8C8D' },
  countTextActive: { color: '#4A90D9' },
  startBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4A90D9',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  startBtnDisabled: { opacity: 0.7 },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
    gap: 10,
  },
  errorText: { color: '#C0392B', fontSize: 16 },
  errorTextMsg: { color: '#C0392B', fontSize: 14, fontWeight: '500' },
  upgradeBtn: {
    backgroundColor: '#F39C12',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  upgradeBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  loadingNote: { textAlign: 'center', fontSize: 13, color: '#7F8C8D' },
});
