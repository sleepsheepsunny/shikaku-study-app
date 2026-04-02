import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FillBlankData, UserAnswer } from '@/types/question';

interface Props {
  data: FillBlankData;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
}

export function FillBlankUI({ data, onAnswer, isSubmitted }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (isSubmitted) return;
    setSelected(id);
    onAnswer(id);
  };

  if (data.blank_hint) {
    // Show hint before choices
  }

  return (
    <View style={styles.container}>
      {data.blank_hint && (
        <View style={styles.hintBox}>
          <Text style={styles.hintLabel}>ヒント</Text>
          <Text style={styles.hintText}>{data.blank_hint}</Text>
        </View>
      )}
      <Text style={styles.instruction}>空欄に入る最も適切なものを選んでください</Text>
      {data.choices.map((choice) => {
        const isSelected = selected === choice.id;
        const isCorrect = isSubmitted && choice.id === data.answer;
        const isWrong = isSubmitted && isSelected && choice.id !== data.answer;

        return (
          <TouchableOpacity
            key={choice.id}
            style={[
              styles.choice,
              isSelected && !isSubmitted && styles.selected,
              isCorrect && styles.correct,
              isWrong && styles.wrong,
            ]}
            onPress={() => handleSelect(choice.id)}
            disabled={isSubmitted}
          >
            <Text style={[styles.choiceLabel, (isCorrect || isWrong) && styles.darkText]}>
              {choice.id}
            </Text>
            <Text style={[styles.choiceText, (isCorrect || isWrong) && styles.darkText]}>
              {choice.text}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  hintBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F39C12',
    marginBottom: 4,
  },
  hintLabel: { fontSize: 11, fontWeight: '700', color: '#F39C12', marginBottom: 2 },
  hintText: { fontSize: 14, color: '#6B5B00' },
  instruction: { fontSize: 13, color: '#7F8C8D', marginBottom: 4 },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    backgroundColor: '#FAFBFE',
    gap: 10,
  },
  selected: { borderColor: '#4A90D9', backgroundColor: '#EBF4FF' },
  correct: { borderColor: '#27AE60', backgroundColor: '#EAFAF1' },
  wrong: { borderColor: '#E74C3C', backgroundColor: '#FDEDEC' },
  choiceLabel: { fontWeight: '700', fontSize: 15, color: '#4A90D9', width: 22 },
  choiceText: { flex: 1, fontSize: 15, color: '#2C3E50' },
  darkText: { color: '#2C3E50' },
});
