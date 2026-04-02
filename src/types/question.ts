export type QuestionUIType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'calculation'
  | 'true_false'
  | 'multi_select';

export type QualificationGenre = 'it' | 'business' | 'language' | 'medical' | 'legal';

export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  qualification_id: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  ui_type: QuestionUIType;
  question_text: string;
  question_data: QuestionData;
  generated_at: string;
}

export interface MultipleChoiceData {
  ui_type: 'multiple_choice';
  choices: Choice[];
  answer: string; // choice id e.g. "A"
  explanation: string;
}

export interface TrueFalseData {
  ui_type: 'true_false';
  choices: Choice[];
  answer: boolean;
  explanation: string;
}

export interface FillBlankData {
  ui_type: 'fill_blank';
  choices: Choice[];
  answer: string; // choice id
  blank_hint?: string;
  explanation: string;
}

export interface CalculationData {
  ui_type: 'calculation';
  answer: number;
  answer_unit?: string;
  answer_precision?: number; // decimal places
  explanation: string;
}

export interface MultiSelectData {
  ui_type: 'multi_select';
  choices: Choice[];
  answer: string[]; // array of choice ids
  explanation: string;
}

export type QuestionData =
  | MultipleChoiceData
  | TrueFalseData
  | FillBlankData
  | CalculationData
  | MultiSelectData;

export type UserAnswer = string | boolean | number | string[];

export interface AnsweredQuestion {
  question: Question;
  userAnswer: UserAnswer;
  isCorrect: boolean;
  timeTaken: number; // seconds
}
