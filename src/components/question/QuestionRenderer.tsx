import React from 'react';
import { Question, UserAnswer, QuestionData } from '@/types/question';
import { MultipleChoiceUI } from './MultipleChoiceUI';
import { TrueFalseUI } from './TrueFalseUI';
import { FillBlankUI } from './FillBlankUI';
import { CalculationUI } from './CalculationUI';
import { MultiSelectUI } from './MultiSelectUI';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  question: Question;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
}

export function QuestionRenderer({ question, onAnswer, isSubmitted }: Props) {
  const { ui_type, question_data } = question;

  switch (ui_type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceUI
          data={question_data as any}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'true_false':
      return (
        <TrueFalseUI
          data={question_data as any}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'fill_blank':
      return (
        <FillBlankUI
          data={question_data as any}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'calculation':
      return (
        <CalculationUI
          data={question_data as any}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'multi_select':
      return (
        <MultiSelectUI
          data={question_data as any}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    default:
      return (
        <View style={styles.error}>
          <Text>未対応の問題形式: {ui_type}</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  error: { padding: 16, alignItems: 'center' },
});
