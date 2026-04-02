import { AnsweredQuestion } from './question';

export interface StudySession {
  id?: string;
  user_id: string;
  qualification_id: string;
  category: string;
  difficulty: number;
  total_questions: number;
  started_at: string;
  ended_at?: string;
  is_completed: boolean;
}

export interface SessionResult {
  session: StudySession;
  answers: AnsweredQuestion[];
  correctCount: number;
  accuracy: number; // 0-100
  totalTimeSec: number;
}

export interface GenerateQuestionsRequest {
  qualificationSlug: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  count: number;
  uiType: string;
}
