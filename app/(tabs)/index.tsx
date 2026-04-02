import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { GENRES, getQualificationsByGenre } from '@/config/qualifications';
import { QualificationConfig } from '@/config/qualifications/types';
import { QualificationGenre } from '@/types/question';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase';

const GENRE_EMOJIS: Record<QualificationGenre, string> = {
  it: '💻',
  business: '💼',
  language: '🌍',
  medical: '🏥',
  legal: '⚖️',
};

interface CustomQual {
  id: string;
  slug: string;
  name: string;
  genre: QualificationGenre;
  description: string | null;
  categories: string[];
}

export default function HomeScreen() {
  const [expandedGenre, setExpandedGenre] = useState<QualificationGenre | null>(null);
  const [expandedQual, setExpandedQual] = useState<string | null>(null);
  const [customQuals, setCustomQuals] = useState<CustomQual[]>([]);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  const loadCustomQuals = useCallback(async () => {
    if (!user) { setCustomQuals([]); return; }
    const { data } = await supabase
      .from('qualifications')
      .select('id, slug, name, genre, description, categories')
      .eq('owner_user_id', user.id)
      .eq('is_active', true);
    setCustomQuals((data as CustomQual[]) ?? []);
  }, [user]);

  useFocusEffect(useCallback(() => { loadCustomQuals(); }, [loadCustomQuals]));

  const handleQualificationSelect = (slug: string) => {
    router.push({ pathname: '/session/setup', params: { slug } });
  };

  const toggleQualInfo = (slug: string) => {
    setExpandedQual(expandedQual === slug ? null : slug);
  };

  const handleDeleteCustomQual = (qual: CustomQual) => {
    Alert.alert(
      `「${qual.name}」を削除`,
      'このマイ資格を削除しますか？学習履歴は保持されます。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('qualifications').delete().eq('id', qual.id);
            loadCustomQuals();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>資格マスター</Text>
          {!user && (
            <Text style={styles.loginHint}>ログイン後に問題を生成できます</Text>
          )}
          {profile && !profile.is_pro && (
            <Text style={styles.quota}>
              今日の残り: {Math.max(0, 10 - (profile.daily_q_count ?? 0))}問
            </Text>
          )}
          {profile?.is_pro && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>Pro</Text>
            </View>
          )}
        </View>

        {/* Aptitude banner */}
        <TouchableOpacity style={styles.aptitudeBanner} onPress={() => router.push('/aptitude')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.aptitudeBannerTitle}>あなたに向いている資格は？</Text>
            <Text style={styles.aptitudeBannerSub}>7問のアンケートで資格を診断する</Text>
          </View>
          <Text style={styles.aptitudeBannerArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>資格を選ぶ</Text>

        {(Object.keys(GENRES) as QualificationGenre[]).map((genre) => {
          const genreInfo = GENRES[genre];
          const qualifications = getQualificationsByGenre(genre);
          const isExpanded = expandedGenre === genre;

          return (
            <View key={genre} style={styles.genreCard}>
              <TouchableOpacity
                style={styles.genreHeader}
                onPress={() => setExpandedGenre(isExpanded ? null : genre)}
              >
                <Text style={styles.genreEmoji}>{GENRE_EMOJIS[genre]}</Text>
                <Text style={styles.genreLabel}>{genreInfo.label}</Text>
                <Text style={styles.genreCount}>{qualifications.length}資格</Text>
                <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.qualList}>
                  {qualifications.map((q) => (
                    <View key={q.slug}>
                      <View style={styles.qualItem}>
                        <TouchableOpacity
                          style={styles.qualItemMain}
                          onPress={() => toggleQualInfo(q.slug)}
                        >
                          <View style={styles.qualItemInfo}>
                            <Text style={styles.qualName}>{q.name}</Text>
                            <Text style={styles.qualCategories}>
                              {q.categories.length}分野 ·{' '}
                              {q.defaultUITypes.map((t) => UI_TYPE_LABELS[t]).join('・')}
                            </Text>
                          </View>
                          <Text style={styles.infoChevron}>
                            {expandedQual === q.slug ? '▲' : '▼'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.startBtn}
                          onPress={() => handleQualificationSelect(q.slug)}
                        >
                          <Text style={styles.startBtnText}>学習開始 ›</Text>
                        </TouchableOpacity>
                      </View>
                      {expandedQual === q.slug && <QualInfoPanel q={q} />}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* My qualifications section */}
        {user && (
          <View style={styles.myQualSection}>
            <Text style={styles.sectionTitle}>マイ資格</Text>

            {customQuals.length > 0 && (
              <View style={styles.genreCard}>
                <View style={styles.qualList}>
                  {customQuals.map((q) => (
                    <TouchableOpacity
                      key={q.slug}
                      style={styles.qualItem}
                      onLongPress={() => handleDeleteCustomQual(q)}
                      onPress={() => handleQualificationSelect(q.slug)}
                    >
                      <View style={styles.qualItemInfo}>
                        <Text style={styles.qualName}>{q.name}</Text>
                        <Text style={styles.qualCategories}>
                          {(q.categories as string[]).join('・') || '一般'} · 長押しで削除
                        </Text>
                      </View>
                      <Text style={styles.startBtnText}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.addQualBtn}
              onPress={() => router.push('/qualification/add')}
            >
              <Text style={styles.addQualBtnText}>＋ 自分の資格を追加</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function QualInfoPanel({ q }: { q: QualificationConfig }) {
  if (!q.description && !q.examInfo) return null;
  const info = q.examInfo;
  return (
    <View style={styles.qualInfoPanel}>
      {q.description && <Text style={styles.qualDescription}>{q.description}</Text>}
      {info && (
        <View style={styles.examInfoGrid}>
          {info.fee && (
            <View style={styles.examInfoRow}>
              <Text style={styles.examInfoKey}>受験料</Text>
              <Text style={styles.examInfoVal}>{info.fee}</Text>
            </View>
          )}
          {info.schedule && (
            <View style={styles.examInfoRow}>
              <Text style={styles.examInfoKey}>試験日程</Text>
              <Text style={styles.examInfoVal}>{info.schedule}</Text>
            </View>
          )}
          {info.passRate && (
            <View style={styles.examInfoRow}>
              <Text style={styles.examInfoKey}>合格率</Text>
              <Text style={styles.examInfoVal}>{info.passRate}</Text>
            </View>
          )}
          {info.officialUrl && (
            <TouchableOpacity onPress={() => Linking.openURL(info.officialUrl!)}>
              <Text style={styles.officialLink}>公式サイトを見る →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const UI_TYPE_LABELS: Record<string, string> = {
  multiple_choice: '4択',
  true_false: '○×',
  fill_blank: '穴埋め',
  calculation: '計算',
  multi_select: '複数選択',
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32, gap: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#2C3E50', flex: 1 },
  loginHint: { fontSize: 11, color: '#E74C3C' },
  quota: { fontSize: 12, color: '#7F8C8D' },
  proBadge: {
    backgroundColor: '#F39C12',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  proBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#7F8C8D', marginBottom: 4 },
  genreCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  genreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  genreEmoji: { fontSize: 22 },
  genreLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: '#2C3E50' },
  genreCount: { fontSize: 12, color: '#BDC3C7' },
  chevron: { fontSize: 12, color: '#BDC3C7' },
  qualList: { borderTopWidth: 1, borderTopColor: '#F0F3FA' },
  qualItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F9FC',
    gap: 8,
  },
  qualItemMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualItemInfo: { flex: 1 },
  qualName: { fontSize: 15, fontWeight: '600', color: '#2C3E50', marginBottom: 2 },
  qualCategories: { fontSize: 12, color: '#95A5A6' },
  infoChevron: { fontSize: 10, color: '#BDC3C7', paddingHorizontal: 6 },
  startBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  startBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  qualInfoPanel: {
    backgroundColor: '#F7FBFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EFF9',
    gap: 10,
  },
  qualDescription: { fontSize: 13, color: '#4A6080', lineHeight: 20 },
  examInfoGrid: { gap: 6 },
  examInfoRow: { flexDirection: 'row', gap: 8 },
  examInfoKey: { fontSize: 12, color: '#7F8C8D', width: 64 },
  examInfoVal: { fontSize: 12, color: '#2C3E50', flex: 1 },
  officialLink: { fontSize: 12, color: '#4A90D9', marginTop: 4 },
  aptitudeBanner: {
    backgroundColor: '#EBF4FF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90D9',
  },
  aptitudeBannerTitle: { fontSize: 14, fontWeight: '700', color: '#2C3E50', marginBottom: 2 },
  aptitudeBannerSub: { fontSize: 12, color: '#4A90D9' },
  aptitudeBannerArrow: { fontSize: 24, color: '#4A90D9' },
  myQualSection: { gap: 10 },
  addQualBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4A90D9',
    borderStyle: 'dashed',
  },
  addQualBtnText: { color: '#4A90D9', fontWeight: '700', fontSize: 15 },
});
