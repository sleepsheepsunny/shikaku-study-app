// ===========================
// 資格適性チェック — スコアリングロジック
// ===========================

export type JobField = 'it' | 'finance' | 'realestate' | 'language' | 'medical' | 'other';
export type Purpose = 'career' | 'promotion' | 'skill' | 'hobby';
export type StudyTime = 'under30' | '1to2h' | 'over2h';
export type Level = 'good' | 'average' | 'weak';
export type Deadline = '3months' | '6months' | '1year' | 'none';

export interface AptitudeAnswers {
  jobField: JobField;
  purpose: Purpose;
  studyTime: StudyTime;
  english: Level;
  math: Level;
  memory: Level;
  deadline: Deadline;
}

export interface QualificationScore {
  slug: string;
  name: string;
  score: number;
  reason: string;
}

// Scoring weights table: [jobField, purpose, studyTime, english, math, memory, deadline]
// Each qualification gets a score contribution for each answer
const WEIGHTS: Record<string, {
  jobField: Partial<Record<JobField, number>>;
  purpose: Partial<Record<Purpose, number>>;
  studyTime: Partial<Record<StudyTime, number>>;
  english: Partial<Record<Level, number>>;
  math: Partial<Record<Level, number>>;
  memory: Partial<Record<Level, number>>;
  deadline: Partial<Record<Deadline, number>>;
}> = {
  'it-passport': {
    jobField: { it: 15, other: 8, finance: 5 },
    purpose: { career: 10, promotion: 12, skill: 8 },
    studyTime: { under30: 10, '1to2h': 8, over2h: 5 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 3, average: 3, weak: 3 },
    memory: { good: 5, average: 5, weak: 3 },
    deadline: { '3months': 15, '6months': 10, '1year': 5, none: 5 },
  },
  'kihon-joho': {
    jobField: { it: 20, other: 5 },
    purpose: { career: 12, promotion: 10, skill: 10 },
    studyTime: { under30: 3, '1to2h': 10, over2h: 12 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 8, average: 5, weak: 2 },
    memory: { good: 8, average: 6, weak: 3 },
    deadline: { '3months': 5, '6months': 12, '1year': 10, none: 8 },
  },
  'ouyo-joho': {
    jobField: { it: 22, other: 3 },
    purpose: { career: 10, promotion: 12, skill: 12 },
    studyTime: { under30: 0, '1to2h': 8, over2h: 18 },
    english: { good: 5, average: 3, weak: 1 },
    math: { good: 10, average: 6, weak: 2 },
    memory: { good: 10, average: 7, weak: 3 },
    deadline: { '3months': 0, '6months': 8, '1year': 15, none: 10 },
  },
  'boki-3': {
    jobField: { finance: 20, it: 8, other: 10 },
    purpose: { career: 12, promotion: 10, skill: 8, hobby: 5 },
    studyTime: { under30: 8, '1to2h': 12, over2h: 8 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 8, average: 6, weak: 3 },
    memory: { good: 8, average: 7, weak: 5 },
    deadline: { '3months': 12, '6months': 12, '1year': 8, none: 5 },
  },
  'boki-2': {
    jobField: { finance: 22, it: 5, other: 8 },
    purpose: { career: 15, promotion: 12, skill: 8 },
    studyTime: { under30: 2, '1to2h': 10, over2h: 15 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 10, average: 7, weak: 2 },
    memory: { good: 8, average: 6, weak: 3 },
    deadline: { '3months': 3, '6months': 10, '1year': 15, none: 8 },
  },
  'fp-3': {
    jobField: { finance: 18, other: 12, realestate: 10 },
    purpose: { career: 10, promotion: 8, skill: 10, hobby: 12 },
    studyTime: { under30: 10, '1to2h': 12, over2h: 8 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 5, average: 5, weak: 5 },
    memory: { good: 8, average: 7, weak: 5 },
    deadline: { '3months': 12, '6months': 12, '1year': 8, none: 5 },
  },
  'fp-2': {
    jobField: { finance: 20, realestate: 12, other: 8 },
    purpose: { career: 15, promotion: 12, skill: 8 },
    studyTime: { under30: 3, '1to2h': 10, 'over2h': 14 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 8, average: 6, weak: 2 },
    memory: { good: 8, average: 6, weak: 3 },
    deadline: { '3months': 5, '6months': 12, '1year': 12, none: 8 },
  },
  'eiken-3': {
    jobField: { language: 20, other: 8, it: 5 },
    purpose: { career: 8, skill: 10, hobby: 15, promotion: 5 },
    studyTime: { under30: 12, '1to2h': 10, over2h: 5 },
    english: { good: 5, average: 8, weak: 10 },
    math: { good: 3, average: 3, weak: 3 },
    memory: { good: 8, average: 7, weak: 5 },
    deadline: { '3months': 15, '6months': 10, '1year': 5, none: 5 },
  },
  'eiken-pre2': {
    jobField: { language: 20, it: 8, other: 8 },
    purpose: { career: 10, skill: 10, hobby: 10 },
    studyTime: { under30: 8, '1to2h': 12, over2h: 8 },
    english: { good: 5, average: 10, weak: 8 },
    math: { good: 3, average: 3, weak: 3 },
    memory: { good: 8, average: 7, weak: 5 },
    deadline: { '3months': 10, '6months': 12, '1year': 8, none: 5 },
  },
  'eiken-2': {
    jobField: { language: 20, it: 8, other: 8 },
    purpose: { career: 12, skill: 10, hobby: 8 },
    studyTime: { under30: 3, '1to2h': 12, over2h: 12 },
    english: { good: 12, average: 8, weak: 2 },
    math: { good: 3, average: 3, weak: 3 },
    memory: { good: 10, average: 8, weak: 4 },
    deadline: { '3months': 5, '6months': 12, '1year': 12, none: 8 },
  },
  'eiken-pre1': {
    jobField: { language: 22, it: 5, other: 5 },
    purpose: { career: 15, skill: 12, hobby: 5 },
    studyTime: { under30: 0, '1to2h': 5, over2h: 20 },
    english: { good: 18, average: 8, weak: 0 },
    math: { good: 3, average: 3, weak: 3 },
    memory: { good: 12, average: 8, weak: 3 },
    deadline: { '3months': 0, '6months': 5, '1year': 15, none: 12 },
  },
  toeic: {
    jobField: { language: 18, it: 10, finance: 8, other: 8 },
    purpose: { career: 18, promotion: 15, skill: 8 },
    studyTime: { under30: 5, '1to2h': 12, over2h: 15 },
    english: { good: 15, average: 10, weak: 3 },
    math: { good: 3, average: 3, weak: 3 },
    memory: { good: 8, average: 7, weak: 5 },
    deadline: { '3months': 8, '6months': 12, '1year': 10, none: 8 },
  },
  'kaigo-fukushi': {
    jobField: { medical: 25, other: 5 },
    purpose: { career: 15, skill: 10, promotion: 8 },
    studyTime: { under30: 5, '1to2h': 12, over2h: 15 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 3, average: 3, weak: 3 },
    memory: { good: 10, average: 8, weak: 5 },
    deadline: { '3months': 0, '6months': 5, '1year': 15, none: 12 },
  },
  'touroku-hanbaisya': {
    jobField: { medical: 22, other: 10 },
    purpose: { career: 15, skill: 10, promotion: 8 },
    studyTime: { under30: 5, '1to2h': 12, over2h: 12 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 3, average: 3, weak: 3 },
    memory: { good: 12, average: 8, weak: 4 },
    deadline: { '3months': 5, '6months': 12, '1year': 12, none: 8 },
  },
  takken: {
    jobField: { realestate: 25, finance: 10, other: 8 },
    purpose: { career: 18, promotion: 12, skill: 8 },
    studyTime: { under30: 2, '1to2h': 10, over2h: 15 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 5, average: 5, weak: 3 },
    memory: { good: 12, average: 8, weak: 4 },
    deadline: { '3months': 0, '6months': 8, '1year': 15, none: 10 },
  },
  'gyosei-shoshi': {
    jobField: { realestate: 18, other: 12, finance: 5 },
    purpose: { career: 18, skill: 10, promotion: 8 },
    studyTime: { under30: 0, '1to2h': 5, over2h: 22 },
    english: { good: 3, average: 3, weak: 3 },
    math: { good: 3, average: 3, weak: 3 },
    memory: { good: 15, average: 10, weak: 3 },
    deadline: { '3months': 0, '6months': 3, '1year': 18, none: 12 },
  },
};

const QUAL_NAMES: Record<string, string> = {
  'it-passport': 'ITパスポート',
  'kihon-joho': '基本情報技術者',
  'ouyo-joho': '応用情報技術者',
  'boki-3': '日商簿記3級',
  'boki-2': '日商簿記2級',
  'fp-3': 'FP技能士3級',
  'fp-2': 'FP技能士2級',
  'eiken-3': '英検3級',
  'eiken-pre2': '英検準2級',
  'eiken-2': '英検2級',
  'eiken-pre1': '英検準1級',
  toeic: 'TOEIC L&R',
  'kaigo-fukushi': '介護福祉士',
  'touroku-hanbaisya': '登録販売者',
  takken: '宅地建物取引士',
  'gyosei-shoshi': '行政書士',
};

const REASONS: Record<string, (a: AptitudeAnswers) => string> = {
  'it-passport': (a) =>
    a.jobField === 'it'
      ? 'IT職種の基礎力証明に最適。短期間で取得でき、即効性があります。'
      : '業界問わず役立つIT基礎知識が身につきます。合格率50%以上で挑戦しやすい資格です。',
  'kihon-joho': () =>
    'ITエンジニアの登竜門。アルゴリズム・ネットワークの体系的な理解が深まります。',
  'ouyo-joho': () =>
    'エンジニア中級の証明。設計・セキュリティ・DBの高度な問題に挑戦できます。',
  'boki-3': (a) =>
    a.studyTime === 'under30'
      ? '1日30分でも3ヶ月で合格可能。会計の基礎が身につく入門資格です。'
      : '仕訳・財務諸表の基礎が体系的に学べ、経理への転職にも有効です。',
  'boki-2': () =>
    '商業・工業簿記をマスター。経理・財務職への転職で高い評価を得られます。',
  'fp-3': (a) =>
    a.purpose === 'hobby'
      ? '保険・税金・投資の基礎が学べ、自分の家計管理にすぐ役立ちます。'
      : '身近なお金の知識を実践的に学べ、半年以内で合格を狙えます。',
  'fp-2': () =>
    'ライフプランニングから相続まで幅広いお金の知識が証明できます。',
  'eiken-3': () =>
    '英語の基礎力確認・ステップアップに最適。短期間での合格が狙えます。',
  'eiken-pre2': () =>
    '英語力の中間チェックポイント。高校英語の定着確認に最適です。',
  'eiken-2': () =>
    '大学入試・就活で広く認知。海外旅行・留学の英語力証明にもなります。',
  'eiken-pre1': () =>
    '大学中級レベルの英語力の証明。英語を武器にしたいなら目指す価値があります。',
  toeic: (a) =>
    a.purpose === 'career' || a.purpose === 'promotion'
      ? '就職・昇進に直結するスコアが取得できます。ビジネス英語力のグローバル基準です。'
      : '月1回以上受験できるので目標スコアに向けて継続的に取り組めます。',
  'kaigo-fukushi': () =>
    '介護の専門知識を証明する国家資格。医療・福祉分野での活躍に必須です。',
  'touroku-hanbaisya': () =>
    'ドラッグストアで医薬品を販売できる資格。医療・流通業界での転職に有効です。',
  takken: () =>
    '不動産業界必須の国家資格。宅建士として独立開業も目指せます。',
  'gyosei-shoshi': () =>
    '行政手続きの専門家として独立開業が可能。法律系資格の中で比較的挑戦しやすい資格です。',
};

export function calculateAptitude(answers: AptitudeAnswers): QualificationScore[] {
  const scores: QualificationScore[] = [];

  for (const [slug, weights] of Object.entries(WEIGHTS)) {
    let score = 0;
    score += weights.jobField[answers.jobField] ?? 0;
    score += weights.purpose[answers.purpose] ?? 0;
    score += weights.studyTime[answers.studyTime] ?? 0;
    score += weights.english[answers.english] ?? 0;
    score += weights.math[answers.math] ?? 0;
    score += weights.memory[answers.memory] ?? 0;
    score += weights.deadline[answers.deadline] ?? 0;

    scores.push({
      slug,
      name: QUAL_NAMES[slug],
      score,
      reason: REASONS[slug]?.(answers) ?? '',
    });
  }

  return scores.sort((a, b) => b.score - a.score).slice(0, 3);
}
