import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TrueFalseData, UserAnswer } from '@/types/question';

interface Props {
  data: TrueFalseData;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
}

export function TrueFalseUI({ data, onAnswer, isSubmitted }: Props) {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSelect = (value: boolean) => {
    if (isSubmitted) return;
    setSelected(value);
    onAnswer(value);
  };

  const getStyle = (value: boolean) => {
    const isSelected = selected === value;
    const isCorrect = isSubmitted && value === data.answer;
    const isWrong = isSubmitted && isSelected && value !== data.answer;
    return [
      styles.button,
      value ? styles.trueButton : styles.falseButton,
      isSelected && !isSubmitted && (value ? styles.trueSelected : styles.falseSelected),
      isCorrect && styles.correct,
      isWrong && styles.wrong,
    ];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={getStyle(true)} onPress={() => handleSelect(true)} disabled={isSubmitted}>
        <Text style={styles.symbol}>○</Text>
        <Text style={styles.label}>正しい</Text>
      </TouchableOpacity>
      <TouchableOpacity style={getStyle(false)} onPress={() => handleSelect(false)} disabled={isSubmitted}>
        <Text style={[styles.symbol, styles.falseSymbol]}>✕</Text>
        <Text style={styles.label}>誤り</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    borderRadius: 14,
    borderWidth: 2,
    gap: 6,
  },
  trueButton: { borderColor: '#27AE60', backgroundColor: '#F9FEF9' },
  falseButton: { borderColor: '#E74C3C', backgroundColor: '#FEF9F9' },
  trueSelected: { backgroundColor: '#EAFAF1', borderWidth: 3 },
  falseSelected: { backgroundColor: '#FDEDEC', borderWidth: 3 },
  correct: { backgroundColor: '#EAFAF1', borderWidth: 3, borderColor: '#27AE60' },
  wrong: { backgroundColor: '#FDEDEC', borderWidth: 3, borderColor: '#E74C3C' },
  symbol: {
    fontSize: 36,
    fontWeight: '700',
    color: '#27AE60',
  },
  falseSymbol: { color: '#E74C3C' },
  label: { fontSize: 15, fontWeight: '600', color: '#2C3E50' },
});
