import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useSessionStore } from '@/stores/sessionStore';
import { QuestionRenderer } from '@/components/question/QuestionRenderer';
import { AIDisclaimer } from '@/components/common/AIDisclaimer';
import { ReportButton } from '@/components/common/ReportButton';
import { UserAnswer } from '@/types/question';

export default function QuestionScreen() {
  const {
    currentQuestion,
    currentIndex,
    questions,
    isSubmitted,
    submitAnswer,
    nextQuestion,
    isComplete,
  } = useSessionStore();

  const question = currentQuestion();

  useEffect(() => {
    if (isComplete()) {
      router.replace('/session/result');
    }
  }, [isComplete()]);

  if (!question) return null;

  const handleAnswer = (answer: UserAnswer) => {
    const correct = checkAnswer(question.question_data, answer);
    submitAnswer(answer, correct);
  };

  const handleNext = () => {
    if (isComplete()) {
      router.replace('/session/result');
    } else {
      nextQuestion();
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      {/* AI Disclaimer - always visible */}
      <AIDisclaimer />

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Counter */}
        <View style={styles.counterRow}>
          <Text style={styles.counter}>
            {currentIndex + 1} / {questions.length}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.difficulty}>難易度 {'★'.repeat(question.difficulty)}</Text>
            <Text style={styles.category}>{question.category}</Text>
          </View>
        </View>

        {/* Question text */}
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{question.question_text}</Text>
        </View>

        {/* Question UI */}
        <QuestionRenderer
          question={question}
          onAnswer={handleAnswer}
          isSubmitted={isSubmitted}
        />

        {/* Explanation (after submit) */}
        {isSubmitted && (
          <View style={styles.explanation}>
            <Text style={styles.explanationTitle}>解説</Text>
            <Text style={styles.explanationText}>
              {(question.question_data as any).explanation}
            </Text>
            <ReportButton questionId={question.id} />
          </View>
        )}

        {/* Next button */}
        {isSubmitted && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentIndex + 1 >= questions.length ? '結果を見る' : '次の問題 →'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function checkAnswer(data: any, userAnswer: UserAnswer): boolean {
  switch (data.ui_type) {
    case 'multiple_choice':
    case 'fill_blank':
      return userAnswer === data.answer;
    case 'true_false':
      return userAnswer === data.answer;
    case 'calculation': {
      const precision = data.answer_precision ?? 0;
      const tolerance = Math.pow(10, -precision) / 2;
      return Math.abs(Number(userAnswer) - data.answer) <= tolerance;
    }
    case 'multi_select': {
      const userArr = [...(userAnswer as string[])].sort();
      const correctArr = [...data.answer].sort();
      return JSON.stringify(userArr) === JSON.stringify(correctArr);
    }
    default:
      return false;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  progressBar: { height: 4, backgroundColor: '#F0F3FA' },
  progressFill: { height: 4, backgroundColor: '#4A90D9' },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: { fontSize: 14, fontWeight: '700', color: '#7F8C8D' },
  meta: { alignItems: 'flex-end', gap: 2 },
  difficulty: { fontSize: 12, color: '#F39C12' },
  category: { fontSize: 11, color: '#BDC3C7' },
  questionBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  questionText: { fontSize: 16, lineHeight: 26, color: '#2C3E50', fontWeight: '500' },
  explanation: {
    backgroundColor: '#EBF4FF',
    borderRadius: 14,
    padding: 16,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90D9',
  },
  explanationTitle: { fontSize: 13, fontWeight: '700', color: '#4A90D9' },
  explanationText: { fontSize: 14, lineHeight: 22, color: '#2C3E50' },
  nextBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
