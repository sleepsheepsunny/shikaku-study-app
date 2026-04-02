import { supabase } from './supabase';
import { AnsweredQuestion } from '@/types/question';

export async function createSession(params: {
  userId: string;
  qualificationId: string;
  category: string;
  totalQuestions: number;
}): Promise<string> {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: params.userId,
      qualification_id: params.qualificationId,
      category: params.category,
      difficulty: 3,
      total_questions: params.totalQuestions,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function completeSession(sessionId: string, answers: AnsweredQuestion[]): Promise<void> {
  const { error: sessionError } = await supabase
    .from('study_sessions')
    .update({ ended_at: new Date().toISOString(), is_completed: true })
    .eq('id', sessionId);

  if (sessionError) throw sessionError;

  const answerRows = answers.map((a) => ({
    session_id: sessionId,
    question_id: a.question.id,
    user_answer: a.userAnswer,
    is_correct: a.isCorrect,
    time_taken: a.timeTaken,
  }));

  const { error: answerError } = await supabase.from('answers').insert(answerRows);
  if (answerError) throw answerError;
}

export async function getQualificationId(slug: string): Promise<string> {
  const { data, error } = await supabase
    .from('qualifications')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data.id;
}

export interface StatsResult {
  totalSessions: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  byCategory: { category: string; correct: number; total: number; accuracy: number }[];
}

export async function getStats(userId: string, qualificationId?: string): Promise<StatsResult> {
  let query = supabase
    .from('answers')
    .select('is_correct, questions(category), study_sessions!inner(user_id, qualification_id)')
    .eq('study_sessions.user_id', userId);

  if (qualificationId) {
    query = query.eq('study_sessions.qualification_id', qualificationId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = data ?? [];
  const totalQuestions = rows.length;
  const correctCount = rows.filter((r) => r.is_correct).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Group by category
  const categoryMap: Record<string, { correct: number; total: number }> = {};
  for (const row of rows) {
    const cat = (row.questions as any)?.category ?? 'unknown';
    if (!categoryMap[cat]) categoryMap[cat] = { correct: 0, total: 0 };
    categoryMap[cat].total++;
    if (row.is_correct) categoryMap[cat].correct++;
  }

  const byCategory = Object.entries(categoryMap).map(([category, { correct, total }]) => ({
    category,
    correct,
    total,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
  }));

  return { totalSessions: 0, totalQuestions, correctCount, accuracy, byCategory };
}

export async function getStreak(userId: string): Promise<number> {
  // 完了セッションの日付一覧を取得（新しい順）
  const { data, error } = await supabase
    .from('study_sessions')
    .select('started_at')
    .eq('user_id', userId)
    .eq('is_completed', true)
    .order('started_at', { ascending: false });

  if (error || !data || data.length === 0) return 0;

  // 日付の重複を排除してセット化（YYYY-MM-DD）
  const uniqueDays = [
    ...new Set(data.map((r) => r.started_at.slice(0, 10))),
  ].sort((a, b) => b.localeCompare(a));

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);

    if (uniqueDays[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
