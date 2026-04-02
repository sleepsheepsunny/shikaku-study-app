import { create } from 'zustand';
import { Question, AnsweredQuestion, UserAnswer } from '@/types/question';

interface SessionState {
  // Setup
  qualificationSlug: string | null;
  qualificationId: string | null;
  category: string | null;
  questionCount: number;

  // Runtime
  sessionId: string | null;
  questions: Question[];
  currentIndex: number;
  answers: AnsweredQuestion[];
  startTime: number | null; // timestamp of current question start
  isSubmitted: boolean; // current question submitted

  // Actions
  setupSession: (params: {
    qualificationSlug: string;
    qualificationId: string;
    category: string;
    questionCount: number;
  }) => void;
  startSession: (questions: Question[], sessionId: string) => void;
  submitAnswer: (answer: UserAnswer, isCorrect: boolean) => void;
  nextQuestion: () => void;
  resetSession: () => void;

  // Derived
  currentQuestion: () => Question | null;
  isComplete: () => boolean;
  score: () => { correct: number; total: number; accuracy: number };
}

export const useSessionStore = create<SessionState>((set, get) => ({
  qualificationSlug: null,
  qualificationId: null,
  category: null,
  questionCount: 10,
  sessionId: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  startTime: null,
  isSubmitted: false,

  setupSession: (params) =>
    set({
      qualificationSlug: params.qualificationSlug,
      qualificationId: params.qualificationId,
      category: params.category,
      questionCount: params.questionCount,
    }),

  startSession: (questions, sessionId) =>
    set({
      questions,
      sessionId,
      currentIndex: 0,
      answers: [],
      startTime: Date.now(),
      isSubmitted: false,
    }),

  submitAnswer: (answer, isCorrect) => {
    const { questions, currentIndex, answers, startTime } = get();
    const question = questions[currentIndex];
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    set({
      answers: [...answers, { question, userAnswer: answer, isCorrect, timeTaken }],
      isSubmitted: true,
    });
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1, isSubmitted: false, startTime: Date.now() });
    }
  },

  resetSession: () =>
    set({
      qualificationSlug: null,
      qualificationId: null,
      category: null,
      questionCount: 10,
      sessionId: null,
      questions: [],
      currentIndex: 0,
      answers: [],
      startTime: null,
      isSubmitted: false,
    }),

  currentQuestion: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] ?? null;
  },

  isComplete: () => {
    const { answers, questionCount } = get();
    return answers.length >= questionCount;
  },

  score: () => {
    const { answers } = get();
    const correct = answers.filter((a) => a.isCorrect).length;
    const total = answers.length;
    return { correct, total, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 };
  },
}));
