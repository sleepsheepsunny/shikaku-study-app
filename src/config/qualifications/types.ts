import { QuestionUIType, QualificationGenre } from '@/types/question';

export interface CategoryConfig {
  id: string;
  label: string;
  uiTypes: QuestionUIType[];
}

export interface ExamInfo {
  fee?: string;
  schedule?: string;
  passRate?: string;
  officialUrl?: string;
}

export interface QualificationConfig {
  slug: string;
  name: string;
  nameShort: string;
  genre: QualificationGenre;
  defaultUITypes: QuestionUIType[];
  categories: CategoryConfig[];
  systemPrompt: string;
  promptGuidelines: string;
  difficultyLabels?: Record<number, string>;
  description?: string;
  examInfo?: ExamInfo;
}
