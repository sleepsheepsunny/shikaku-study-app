import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AptitudeAnswers,
  JobField,
  Purpose,
  StudyTime,
  Level,
  Deadline,
  calculateAptitude,
  QualificationScore,
} from '@/utils/aptitude';

const APTITUDE_RESULT_KEY = 'aptitude_result_v1';

type Step = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'result';

const TOTAL_STEPS = 7;

export default function AptitudeScreen() {
  const [step, setStep] = useState<Step>('q1');
  const [answers, setAnswers] = useState<Partial<AptitudeAnswers>>({});
  const [results, setResults] = useState<QualificationScore[]>([]);

  const stepIndex: Record<Step, number> = {
    q1: 1, q2: 2, q3: 3, q4: 4, q5: 5, q6: 6, q7: 7, result: 7,
  };

  const goNext = (nextStep: Step) => setStep(nextStep);

  const finish = async (finalAnswers: AptitudeAnswers) => {
    const top3 = calculateAptitude(finalAnswers);
    setResults(top3);
    setStep('result');
    try {
      await AsyncStorage.setItem(APTITUDE_RESULT_KEY, JSON.stringify(top3));
    } catch {
      // ignore storage errors
    }
  };

  const renderProgress = (current: number) => (
    <View style={styles.progressBar}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View
          key={i}
          style={[styles.progressDot, i < current && styles.progressDotActive]}
        />
      ))}
    </View>
  );

  if (step === 'q1') {
    return (
      <QuestionScreen
        progress={renderProgress(stepIndex.q1)}
        questionNum={1}
        question="現在の職種・関心分野は？"
        options={[
          { label: 'IT・テクノロジー', value: 'it' },
          { label: '金融・会計', value: 'finance' },
          { label: '不動産・法律', value: 'realestate' },
          { label: '語学・国際', value: 'language' },
          { label: '医療・福祉', value: 'medical' },
          { label: 'その他・まだ決めていない', value: 'other' },
        ]}
        onSelect={(v) => {
          setAnswers({ ...answers, jobField: v as JobField });
          goNext('q2');
        }}
      />
    );
  }

  if (step === 'q2') {
    return (
      <QuestionScreen
        progress={renderProgress(stepIndex.q2)}
        questionNum={2}
        question="資格取得の目的は？"
        options={[
          { label: '転職・就職のため', value: 'career' },
          { label: '昇給・昇格のため', value: 'promotion' },
          { label: 'スキルアップのため', value: 'skill' },
          { label: '趣味・教養として', value: 'hobby' },
        ]}
        onSelect={(v) => {
          setAnswers({ ...answers, purpose: v as Purpose });
          goNext('q3');
        }}
      />
    );
  }

  if (step === 'q3') {
    return (
      <QuestionScreen
        progress={renderProgress(stepIndex.q3)}
        questionNum={3}
        question="1日あたりの勉強時間は？"
        options={[
          { label: '30分未満', value: 'under30' },
          { label: '1〜2時間', value: '1to2h' },
          { label: '2時間以上', value: 'over2h' },
        ]}
        onSelect={(v) => {
          setAnswers({ ...answers, studyTime: v as StudyTime });
          goNext('q4');
        }}
      />
    );
  }

  if (step === 'q4') {
    return (
      <QuestionScreen
        progress={renderProgress(stepIndex.q4)}
        questionNum={4}
        question="英語は得意ですか？"
        options={[
          { label: '得意（日常会話以上）', value: 'good' },
          { label: '普通（読み書きはできる）', value: 'average' },
          { label: '苦手（できれば避けたい）', value: 'weak' },
        ]}
        onSelect={(v) => {
          setAnswers({ ...answers, english: v as Level });
          goNext('q5');
        }}
      />
    );
  }

  if (step === 'q5') {
    return (
      <QuestionScreen
        progress={renderProgress(stepIndex.q5)}
        questionNum={5}
        question="計算・数字は得意ですか？"
        options={[
          { label: '得意', value: 'good' },
          { label: '普通', value: 'average' },
          { label: '苦手', value: 'weak' },
        ]}
        onSelect={(v) => {
          setAnswers({ ...answers, math: v as Level });
          goNext('q6');
        }}
      />
    );
  }

  if (step === 'q6') {
    return (
      <QuestionScreen
        progress={renderProgress(stepIndex.q6)}
        questionNum={6}
        question="暗記は得意ですか？"
        options={[
          { label: '得意', value: 'good' },
          { label: '普通', value: 'average' },
          { label: '苦手', value: 'weak' },
        ]}
        onSelect={(v) => {
          setAnswers({ ...answers, memory: v as Level });
          goNext('q7');
        }}
      />
    );
  }

  if (step === 'q7') {
    return (
      <QuestionScreen
        progress={renderProgress(stepIndex.q7)}
        questionNum={7}
        question="試験合格の目標期限は？"
        options={[
          { label: '3ヶ月以内', value: '3months' },
          { label: '半年以内', value: '6months' },
          { label: '1年以内', value: '1year' },
          { label: '特に決めていない', value: 'none' },
        ]}
        onSelect={(v) => {
          const finalAnswers = { ...answers, deadline: v as Deadline } as AptitudeAnswers;
          setAnswers(finalAnswers);
          finish(finalAnswers);
        }}
      />
    );
  }

  // Results screen
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ 戻る</Text>
          </TouchableOpacity>
          <Text style={styles.resultTitle}>あなたへのおすすめ資格</Text>
          <Text style={styles.resultSubtitle}>回答をもとに相性の良い資格を選びました</Text>
        </View>

        {results.map((r, i) => (
          <View key={r.slug} style={[styles.resultCard, i === 0 && styles.resultCardTop]}>
            {i === 0 && (
              <View style={styles.topBadge}>
                <Text style={styles.topBadgeText}>最もおすすめ</Text>
              </View>
            )}
            <Text style={styles.resultRank}>#{i + 1}</Text>
            <Text style={styles.resultName}>{r.name}</Text>
            <Text style={styles.resultReason}>{r.reason}</Text>
            <TouchableOpacity
              style={styles.studyBtn}
              onPress={() => router.replace({ pathname: '/session/setup', params: { slug: r.slug } })}
            >
              <Text style={styles.studyBtnText}>この資格で学習を始める →</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.retryBtn} onPress={() => setStep('q1')}>
          <Text style={styles.retryBtnText}>もう一度診断する</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuestionScreen({
  progress,
  questionNum,
  question,
  options,
  onSelect,
}: {
  progress: React.ReactNode;
  questionNum: number;
  question: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ 閉じる</Text>
        </TouchableOpacity>
        {progress}
        <Text style={styles.questionNum}>Q{questionNum}</Text>
        <Text style={styles.questionText}>{question}</Text>
        <View style={styles.optionList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={styles.optionBtn}
              onPress={() => onSelect(opt.value)}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  header: { gap: 4 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, color: '#4A90D9' },
  progressBar: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDE3EE',
  },
  progressDotActive: { backgroundColor: '#4A90D9' },
  questionNum: { fontSize: 13, color: '#4A90D9', fontWeight: '700' },
  questionText: { fontSize: 22, fontWeight: '800', color: '#2C3E50', lineHeight: 32 },
  optionList: { gap: 12, marginTop: 8 },
  optionBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionText: { fontSize: 15, color: '#2C3E50', fontWeight: '500' },
  resultTitle: { fontSize: 22, fontWeight: '800', color: '#2C3E50' },
  resultSubtitle: { fontSize: 13, color: '#7F8C8D' },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  resultCardTop: {
    borderWidth: 2,
    borderColor: '#4A90D9',
  },
  topBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A90D9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  topBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  resultRank: { fontSize: 13, color: '#BDC3C7', fontWeight: '700' },
  resultName: { fontSize: 20, fontWeight: '800', color: '#2C3E50' },
  resultReason: { fontSize: 14, color: '#4A6080', lineHeight: 22 },
  studyBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  studyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  retryBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE3EE',
  },
  retryBtnText: { color: '#7F8C8D', fontWeight: '600', fontSize: 14 },
});
