import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';
import { QualificationGenre } from '@/types/question';

const GENRE_OPTIONS: { id: QualificationGenre; label: string; emoji: string }[] = [
  { id: 'it', label: 'IT・テクノロジー', emoji: '💻' },
  { id: 'business', label: 'ビジネス・会計', emoji: '💼' },
  { id: 'language', label: '語学', emoji: '🌍' },
  { id: 'medical', label: '医療・福祉', emoji: '🏥' },
  { id: 'legal', label: '法律・不動産', emoji: '⚖️' },
];

export default function AddQualificationScreen() {
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState('');
  const [genre, setGenre] = useState<QualificationGenre>('it');
  const [description, setDescription] = useState('');
  const [categoriesText, setCategoriesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = '資格名を入力してください';
    if (description.trim().length < 50)
      errs.description = `試験の概要を50文字以上で入力してください（現在${description.trim().length}文字）`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }
    if (!validate()) return;

    const categories = categoriesText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (categories.length === 0) categories.push('一般');

    setSaving(true);
    try {
      const slug = `custom-${Date.now()}-${user.id.slice(0, 8)}`;

      const { error } = await supabase.from('qualifications').insert({
        slug,
        name: name.trim(),
        name_short: name.trim().slice(0, 10),
        genre,
        ui_types: ['multiple_choice'],
        categories,
        system_prompt: `あなたは「${name.trim()}」の問題作成専門家です。試験の概要: ${description.trim()}`,
        description: description.trim(),
        owner_user_id: user.id,
        is_active: true,
      });

      if (error) throw error;

      Alert.alert('追加完了', `「${name.trim()}」をマイ資格に追加しました`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('エラー', e.message ?? '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ 戻る</Text>
          </TouchableOpacity>
          <Text style={styles.title}>資格を追加</Text>
          <Text style={styles.subtitle}>AIが問題を生成する自分専用の資格を登録できます</Text>
        </View>

        {/* 資格名 */}
        <View style={styles.section}>
          <Text style={styles.label}>資格名 <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="例: 野菜ソムリエ、○○社内検定"
            placeholderTextColor="#BDC3C7"
            maxLength={50}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* ジャンル */}
        <View style={styles.section}>
          <Text style={styles.label}>ジャンル <Text style={styles.required}>*</Text></Text>
          <View style={styles.chipGrid}>
            {GENRE_OPTIONS.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[styles.chip, genre === g.id && styles.chipActive]}
                onPress={() => setGenre(g.id)}
              >
                <Text style={styles.chipEmoji}>{g.emoji}</Text>
                <Text style={[styles.chipText, genre === g.id && styles.chipTextActive]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 説明 */}
        <View style={styles.section}>
          <Text style={styles.label}>
            試験の概要・特徴 <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.hint}>
            AIが問題を生成するために使います。試験範囲・出題傾向・特徴を詳しく書いてください（50文字以上）
          </Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            value={description}
            onChangeText={setDescription}
            placeholder="例: 野菜と果物の知識・品質・栄養・産地・調理法などを問う民間資格。一次試験は筆記（4択）で、農林水産省統計などのデータからも出題される。"
            placeholderTextColor="#BDC3C7"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, description.length >= 50 && styles.charCountOk]}>
            {description.length}文字 {description.length >= 50 ? '✓' : '（50文字以上）'}
          </Text>
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* カテゴリ */}
        <View style={styles.section}>
          <Text style={styles.label}>カテゴリ（省略可）</Text>
          <Text style={styles.hint}>カンマ区切りで入力。省略した場合は「一般」になります。</Text>
          <TextInput
            style={styles.input}
            value={categoriesText}
            onChangeText={setCategoriesText}
            placeholder="例: 野菜の種類, 栄養素, 調理法, 産地"
            placeholderTextColor="#BDC3C7"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>マイ資格に追加する</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          追加した資格はあなただけに表示されます。AIが試験概要をもとに問題を自動生成します。
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  header: { gap: 4 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, color: '#4A90D9' },
  title: { fontSize: 22, fontWeight: '800', color: '#2C3E50' },
  subtitle: { fontSize: 13, color: '#7F8C8D' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  label: { fontSize: 14, fontWeight: '700', color: '#2C3E50' },
  required: { color: '#E74C3C' },
  hint: { fontSize: 12, color: '#95A5A6', lineHeight: 18 },
  input: {
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#2C3E50',
    backgroundColor: '#FAFBFE',
  },
  inputError: { borderColor: '#E74C3C' },
  textArea: {
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#2C3E50',
    backgroundColor: '#FAFBFE',
    minHeight: 120,
  },
  charCount: { fontSize: 12, color: '#BDC3C7', textAlign: 'right' },
  charCountOk: { color: '#27AE60' },
  errorText: { fontSize: 12, color: '#E74C3C' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    backgroundColor: '#FAFBFE',
  },
  chipActive: { borderColor: '#4A90D9', backgroundColor: '#EBF4FF' },
  chipEmoji: { fontSize: 14 },
  chipText: { fontSize: 13, color: '#7F8C8D' },
  chipTextActive: { color: '#4A90D9', fontWeight: '700' },
  saveBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4A90D9',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  note: { fontSize: 12, color: '#95A5A6', textAlign: 'center', lineHeight: 18 },
});
