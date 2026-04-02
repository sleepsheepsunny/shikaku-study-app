import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MultiSelectData, UserAnswer } from '@/types/question';

interface Props {
  data: MultiSelectData;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
}

export function MultiSelectUI({ data, onAnswer, isSubmitted }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const toggle = (id: string) => {
    if (confirmed || isSubmitted) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (confirmed || selected.length === 0) return;
    setConfirmed(true);
    onAnswer(selected);
  };

  const correctSet = new Set(data.answer);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>正しいものをすべて選んでください（{data.answer.length}つ）</Text>
      {data.choices.map((choice) => {
        const isSelected = selected.includes(choice.id);
        const isCorrect = confirmed && correctSet.has(choice.id);
        const isWrong = confirmed && isSelected && !correctSet.has(choice.id);
        const isMissed = confirmed && !isSelected && correctSet.has(choice.id);

        return (
          <TouchableOpacity
            key={choice.id}
            style={[
              styles.choice,
              isSelected && !confirmed && styles.selected,
              isCorrect && styles.correct,
              isWrong && styles.wrong,
              isMissed && styles.missed,
            ]}
            onPress={() => toggle(choice.id)}
            disabled={confirmed || isSubmitted}
          >
            <View style={[styles.checkbox, isSelected && !confirmed && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
              {isMissed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.choiceLabel, (isCorrect || isWrong || isMissed) && styles.darkText]}>
              {choice.id}
            </Text>
            <Text style={[styles.choiceText, (isCorrect || isWrong || isMissed) && styles.darkText]}>
              {choice.text}
            </Text>
          </TouchableOpacity>
        );
      })}
      {!confirmed && !isSubmitted && (
        <TouchableOpacity
          style={[styles.confirmBtn, selected.length === 0 && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={selected.length === 0}
        >
          <Text style={styles.confirmBtnText}>選択を確定する</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
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
  missed: { borderColor: '#F39C12', backgroundColor: '#FEF9E7' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#BDC3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { borderColor: '#4A90D9', backgroundColor: '#4A90D9' },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  choiceLabel: { fontWeight: '700', fontSize: 15, color: '#4A90D9', width: 22 },
  choiceText: { flex: 1, fontSize: 15, color: '#2C3E50' },
  darkText: { color: '#2C3E50' },
  confirmBtn: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  confirmBtnDisabled: { backgroundColor: '#BDC3C7' },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
