import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MultipleChoiceData, UserAnswer } from '@/types/question';

interface Props {
  data: MultipleChoiceData;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
}

export function MultipleChoiceUI({ data, onAnswer, isSubmitted }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (isSubmitted) return;
    setSelected(id);
    onAnswer(id);
  };

  return (
    <View style={styles.container}>
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
            <Text style={[styles.choiceLabel, (isCorrect || isWrong) && styles.choiceLabelDark]}>
              {choice.id}
            </Text>
            <Text style={[styles.choiceText, (isCorrect || isWrong) && styles.choiceLabelDark]}>
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
  selected: {
    borderColor: '#4A90D9',
    backgroundColor: '#EBF4FF',
  },
  correct: {
    borderColor: '#27AE60',
    backgroundColor: '#EAFAF1',
  },
  wrong: {
    borderColor: '#E74C3C',
    backgroundColor: '#FDEDEC',
  },
  choiceLabel: {
    fontWeight: '700',
    fontSize: 15,
    color: '#4A90D9',
    width: 22,
  },
  choiceText: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
  },
  choiceLabelDark: {
    color: '#2C3E50',
  },
});
