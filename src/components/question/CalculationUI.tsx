import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { CalculationData, UserAnswer } from '@/types/question';

interface Props {
  data: CalculationData;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
}

export function CalculationUI({ data, onAnswer, isSubmitted }: Props) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!input.trim() || submitted) return;
    const value = parseFloat(input.replace(/,/g, ''));
    if (isNaN(value)) return;
    setSubmitted(true);
    Keyboard.dismiss();
    onAnswer(value);
  };

  const precision = data.answer_precision ?? 0;
  const isCorrect = submitted && Math.abs(parseFloat(input.replace(/,/g, '')) - data.answer) < Math.pow(10, -precision) / 2;

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>計算して答えを入力してください</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            submitted && isCorrect && styles.inputCorrect,
            submitted && !isCorrect && styles.inputWrong,
          ]}
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          placeholder="数値を入力..."
          placeholderTextColor="#BDC3C7"
          editable={!submitted && !isSubmitted}
        />
        {data.answer_unit && (
          <Text style={styles.unit}>{data.answer_unit}</Text>
        )}
      </View>
      {!submitted && !isSubmitted && (
        <TouchableOpacity
          style={[styles.submitBtn, !input.trim() && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!input.trim()}
        >
          <Text style={styles.submitBtnText}>答えを提出</Text>
        </TouchableOpacity>
      )}
      {isSubmitted && (
        <View style={[styles.answerBox, isCorrect ? styles.answerCorrect : styles.answerWrong]}>
          <Text style={styles.answerLabel}>正解: {data.answer}{data.answer_unit ?? ''}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  instruction: { fontSize: 14, color: '#7F8C8D' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    borderRadius: 10,
    padding: 14,
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    backgroundColor: '#FAFBFE',
    textAlign: 'center',
  },
  inputCorrect: { borderColor: '#27AE60', backgroundColor: '#EAFAF1' },
  inputWrong: { borderColor: '#E74C3C', backgroundColor: '#FDEDEC' },
  unit: { fontSize: 16, fontWeight: '600', color: '#7F8C8D' },
  submitBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#BDC3C7' },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  answerBox: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  answerCorrect: { backgroundColor: '#EAFAF1' },
  answerWrong: { backgroundColor: '#FDEDEC' },
  answerLabel: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
});
