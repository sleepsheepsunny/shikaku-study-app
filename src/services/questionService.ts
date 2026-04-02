import { supabase } from './supabase';
import { Question, QuestionUIType } from '@/types/question';

interface FetchQuestionsParams {
  qualificationSlug: string;
  qualificationId: string;
  category: string;
  count: number;
  uiType: QuestionUIType;
  userId: string;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export async function fetchQuestions(params: FetchQuestionsParams): Promise<Question[]> {
  const { qualificationSlug, qualificationId, category, count, uiType, userId } = params;

  // 1. Try cache first
  const { data: cached } = await supabase
    .from('questions')
    .select('*')
    .eq('qualification_id', qualificationId)
    .eq('category', category)
    .eq('ui_type', uiType)
    .eq('is_hidden', false)
    .limit(count * 3);

  if (cached && cached.length >= count) {
    return shuffle(cached).slice(0, count) as Question[];
  }

  // 2. Generate via Edge Function
  const { data, error } = await supabase.functions.invoke('generate-questions', {
    body: {
      qualificationSlug,
      qualificationId,
      category,
      count,
      uiType,
      userId,
    },
  });

  if (error) {
    // Extract actual response body from FunctionsHttpError
    let detail = error.message;
    try {
      const body = await (error as any).context?.text?.();
      if (body) {
        const parsed = JSON.parse(body);
        detail = parsed.error ?? body;
      }
    } catch {
      // ignore parse failure, use original message
    }
    console.error('[questionService] Edge Function error detail:', detail);
    throw new Error(`問題生成エラー: ${detail}`);
  }

  if (data?.error) {
    throw new Error(`問題生成エラー: ${data.error}`);
  }

  const generated: Question[] = data.questions;

  // Merge cached + generated, deduplicate, return count
  const all = shuffle([...(cached ?? []), ...generated]);
  return all.slice(0, count) as Question[];
}

export async function reportQuestion(questionId: string, userId: string, reason?: string): Promise<void> {
  const { error } = await supabase.from('question_reports').insert({
    question_id: questionId,
    user_id: userId,
    reason: reason ?? null,
  });
  if (error && error.code !== '23505') {
    // 23505 = unique violation (already reported)
    throw error;
  }
}
