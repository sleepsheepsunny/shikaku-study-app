import { createClient } from 'npm:@supabase/supabase-js@2';

// ---- Types ----
interface GenerateRequest {
  qualificationSlug: string;
  qualificationId: string;
  category: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  count: number;
  uiType: string;
  userId: string;
}

// ---- JSON schemas per UI type ----
const JSON_SCHEMAS: Record<string, string> = {
  multiple_choice: `{
  "questions": [
    {
      "question_text": "問題文",
      "ui_type": "multiple_choice",
      "choices": [
        {"id": "A", "text": "選択肢A"},
        {"id": "B", "text": "選択肢B"},
        {"id": "C", "text": "選択肢C"},
        {"id": "D", "text": "選択肢D"}
      ],
      "answer": "B",
      "explanation": "解説（正解・不正解の理由を両方書く）",
      "difficulty": 3,
      "category": "カテゴリ名"
    }
  ]
}`,
  true_false: `{
  "questions": [
    {
      "question_text": "正しいか誤りかを判断する文",
      "ui_type": "true_false",
      "choices": [
        {"id": "true", "text": "○（正しい）"},
        {"id": "false", "text": "×（誤り）"}
      ],
      "answer": true,
      "explanation": "解説",
      "difficulty": 2,
      "category": "カテゴリ名"
    }
  ]
}`,
  fill_blank: `{
  "questions": [
    {
      "question_text": "次の文の【　】に入る最も適切な語句を選んでください。\\n「文章の【　】部分。」",
      "ui_type": "fill_blank",
      "choices": [
        {"id": "A", "text": "選択肢A"},
        {"id": "B", "text": "選択肢B"},
        {"id": "C", "text": "選択肢C"},
        {"id": "D", "text": "選択肢D"}
      ],
      "answer": "A",
      "blank_hint": "ヒント（省略可）",
      "explanation": "解説",
      "difficulty": 3,
      "category": "カテゴリ名"
    }
  ]
}`,
  calculation: `{
  "questions": [
    {
      "question_text": "計算問題の問題文",
      "ui_type": "calculation",
      "answer": 42500,
      "answer_unit": "円",
      "answer_precision": 0,
      "explanation": "計算過程を含む解説。式: ... = 42,500円",
      "difficulty": 3,
      "category": "カテゴリ名"
    }
  ]
}`,
  multi_select: `{
  "questions": [
    {
      "question_text": "次のうち正しいものを2つ選んでください。",
      "ui_type": "multi_select",
      "choices": [
        {"id": "A", "text": "選択肢A"},
        {"id": "B", "text": "選択肢B"},
        {"id": "C", "text": "選択肢C"},
        {"id": "D", "text": "選択肢D"}
      ],
      "answer": ["A", "C"],
      "explanation": "解説",
      "difficulty": 4,
      "category": "カテゴリ名"
    }
  ]
}`,
};

// ---- Qualification prompt configs ----
const QUALIFICATION_PROMPTS: Record<string, { systemPrompt: string; guidelines: string }> = {
  'kihon-joho': {
    systemPrompt: 'あなたは基本情報技術者試験の問題作成専門家です。IPAの試験シラバスに準拠した問題を作成します。',
    guidelines: '- 選択肢は4つ、正解1つ\n- 難易度1-2: 用語定義, 3: 応用, 4-5: 複合問題',
  },
  'ouyo-joho': {
    systemPrompt: 'あなたは応用情報技術者試験の問題作成専門家です。高度な技術理解を問う問題を作成します。',
    guidelines: '- 4択または複数正解問題\n- 設計・応用・トレードオフを問う問題を中心に',
  },
  'it-passport': {
    systemPrompt: 'あなたはITパスポート試験の問題作成専門家です。IT基礎知識・DXに関する問題を作成します。',
    guidelines: '- 選択肢4つ、正解1つ\n- IT初学者向けの明確な問題文',
  },
  'boki-2': {
    systemPrompt: 'あなたは日商簿記2級の問題作成専門家です。商業簿記・工業簿記・原価計算の問題を作成します。',
    guidelines: '- 仕訳問題は4択\n- 計算問題は数値を求める形式、計算過程を解説に含める',
  },
  'boki-3': {
    systemPrompt: 'あなたは日商簿記3級の問題作成専門家です。入門〜基礎レベルの簿記問題を作成します。',
    guidelines: '- 基本的な勘定科目を使用\n- 1-2ステップで解ける計算問題',
  },
  'fp-2': {
    systemPrompt: 'あなたはFP技能士2級の問題作成専門家です。ライフプランニング・税・投資・不動産・相続の問題を作成します。',
    guidelines: '- 現実的な数値を使用\n- 計算問題は計算過程を解説に含める',
  },
  'fp-3': {
    systemPrompt: 'あなたはFP技能士3級の問題作成専門家です。基礎的なFP知識の問題を作成します。',
    guidelines: '- 身近なお金の話題に関連付ける\n- ○×問題は明確に正誤が判断できる文',
  },
  'eiken-3': {
    systemPrompt: 'You are an expert in creating Eiken Grade 3 questions at middle school English level.',
    guidelines: '- Middle school English vocabulary\n- Question text and choices in English\n- Explanations in Japanese',
  },
  'eiken-pre2': {
    systemPrompt: 'You are an expert in creating Eiken Grade Pre-2 questions at high school basic English level.',
    guidelines: '- High school English level\n- Question text in English\n- Explanations in Japanese',
  },
  'eiken-2': {
    systemPrompt: 'You are an expert in creating Eiken Grade 2 questions at high school graduation English level.',
    guidelines: '- High school graduation English level\n- Question text in English\n- Explanations in Japanese',
  },
  'eiken-pre1': {
    systemPrompt: 'You are an expert in creating Eiken Grade Pre-1 questions at university intermediate level (CEFR B2).',
    guidelines: '- University intermediate English\n- Question text in English\n- Explanations in Japanese',
  },
  toeic: {
    systemPrompt: 'You are an expert in creating TOEIC L&R questions. Create business English questions in TOEIC format.',
    guidelines: '- Part 5: Grammar/vocab fill-in-the-blank\n- Question text in English\n- Explanations in Japanese',
  },
  'kaigo-fukushi': {
    systemPrompt: 'あなたは介護福祉士国家試験の問題作成専門家です。介護現場の実践的な問題を作成します。',
    guidelines: '- 選択肢は5つ、正解1つ\n- 具体的な介護場面の事例を含める',
  },
  'touroku-hanbaisya': {
    systemPrompt: 'あなたは登録販売者試験の問題作成専門家です。一般用医薬品に関する問題を作成します。',
    guidelines: '- 選択肢は5つ、正解1つ\n- 成分名・効能・副作用の問題を中心に',
  },
  takken: {
    systemPrompt: 'あなたは宅地建物取引士試験の問題作成専門家です。不動産取引・宅建業法・民法の問題を作成します。',
    guidelines: '- 選択肢は4つ、正解1つ（○×除く）\n- 具体的な不動産取引事例を含める',
  },
  'gyosei-shoshi': {
    systemPrompt: 'あなたは行政書士試験の問題作成専門家です。行政法・民法・憲法・商法の高度な問題を作成します。',
    guidelines: '- 選択肢は5つ、正解1つ（複数選択除く）\n- 条文の正確な解釈・判例に基づいた問題',
  },
};

// ---- Call Gemini API ----
async function callGemini(systemPrompt: string, userMessage: string, apiKey: string): Promise<string> {
  // gemini-2.5-flash supports free tier via v1beta
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ---- Main handler ----
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    // Auth — accept both user JWT and service_role key
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Unauthorized: no token');
    const token = authHeader.replace('Bearer ', '');

    // Service role key bypasses user auth (for testing)
    const isServiceRole = token === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    let userId_from_token = '';

    if (!isServiceRole) {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
      if (authError || !user) {
        console.error('Auth error:', authError?.message);
        throw new Error(`Unauthorized: ${authError?.message ?? 'invalid token'}`);
      }
      userId_from_token = user.id;
    }

    const body: GenerateRequest = await req.json();
    const { qualificationSlug, qualificationId, category, count, uiType, userId } = body;
    const difficulty = body.difficulty ?? 3;

    // Quota check for free users
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('is_pro, daily_q_count, daily_q_reset')
      .eq('id', userId)
      .single();

    if (profile && !profile.is_pro) {
      const today = new Date().toISOString().split('T')[0];
      const currentCount = profile.daily_q_reset === today ? (profile.daily_q_count ?? 0) : 0;
      if (currentCount + count > 10) {
        return new Response(
          JSON.stringify({ error: 'daily_limit_exceeded', remaining: Math.max(0, 10 - currentCount) }),
          { status: 429, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }

    // Get prompt config — fall back to DB description for custom qualifications
    let promptConfig = QUALIFICATION_PROMPTS[qualificationSlug];
    if (!promptConfig) {
      const { data: qual } = await supabaseClient
        .from('qualifications')
        .select('name, description')
        .eq('id', qualificationId)
        .single();

      if (!qual?.description) throw new Error(`Unknown qualification: ${qualificationSlug}`);

      promptConfig = {
        systemPrompt: `あなたは「${qual.name}」の問題作成専門家です。\n試験の概要: ${qual.description}\nこの試験の出題傾向に合わせた問題を作成してください。`,
        guidelines: '- 試験の概要に記載された範囲から出題してください\n- 問題文は明確で曖昧さがないこと',
      };
    }

    const schema = JSON_SCHEMAS[uiType];
    if (!schema) throw new Error(`Unknown UI type: ${uiType}`);

    const systemPrompt = `${promptConfig.systemPrompt}

## 出力形式
必ず以下のJSON形式のみで回答してください。JSON以外のテキストは一切含めないでください。
${schema}

## 問題作成ガイドライン
${promptConfig.guidelines}

## 品質基準
- 問題文は明確で曖昧さがないこと
- 解説は正解の理由と不正解の理由を両方含めること
- 実際の試験に出題されうる内容であること`;

    const userMessage = `以下の条件で問題を${count}問作成してください。

分野: ${category}
難易度: ${difficulty}/5
問題形式: ${uiType}

JSONのみを返してください。questionsキーを持つオブジェクトを返してください。`;

    // Call Gemini with retry
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;
    let parsed: any = null;
    let lastError = '';

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const raw = await callGemini(systemPrompt, userMessage, geminiApiKey);
        console.log(`[attempt ${attempt + 1}] raw length: ${raw.length}`);

        // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
        let cleaned = raw
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```\s*$/, '')
          .trim();

        // Extract outermost JSON object
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start === -1 || end === -1) throw new Error('No JSON object found in response');
        cleaned = cleaned.slice(start, end + 1);

        parsed = JSON.parse(cleaned);
        if (!parsed.questions || !Array.isArray(parsed.questions)) {
          throw new Error('Invalid JSON: missing questions array');
        }
        if (parsed.questions.length === 0) {
          throw new Error('Empty questions array');
        }
        break;
      } catch (e: any) {
        lastError = e.message;
        console.error(`[attempt ${attempt + 1}] parse error:`, lastError);
        if (attempt === 2) throw new Error(`Generation failed after 3 attempts: ${lastError}`);
      }
    }

    // Cache to DB
    const toInsert = parsed.questions.map((q: any) => ({
      qualification_id: qualificationId,
      category,
      difficulty,
      ui_type: uiType,
      question_text: q.question_text,
      question_data: q,
    }));

    const { data: inserted, error: insertError } = await supabaseClient
      .from('questions')
      .insert(toInsert)
      .select('*');

    if (insertError) console.error('Cache insert error:', insertError);

    // Update daily quota
    const today = new Date().toISOString().split('T')[0];
    await supabaseClient.rpc('increment_daily_quota', {
      p_user_id: userId,
      p_count: count,
      p_today: today,
    });

    const questions = inserted ?? toInsert.map((q: any, i: number) => ({
      ...q,
      id: `temp-${i}`,
      generated_at: new Date().toISOString(),
    }));

    return new Response(JSON.stringify({ questions }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Edge Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
