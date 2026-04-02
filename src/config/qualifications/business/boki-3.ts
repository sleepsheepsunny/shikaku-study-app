import { QualificationConfig } from '../types';

export const boki3Config: QualificationConfig = {
  slug: 'boki-3',
  name: '日商簿記3級',
  nameShort: '簿記3級',
  genre: 'business',
  defaultUITypes: ['multiple_choice', 'calculation'],
  categories: [
    { id: 'basic-concepts', label: '簿記の基礎', uiTypes: ['multiple_choice'] },
    { id: 'journal-entries', label: '仕訳', uiTypes: ['multiple_choice'] },
    { id: 'financial-statements', label: '財務諸表', uiTypes: ['multiple_choice', 'calculation'] },
    { id: 'accounts', label: '勘定科目', uiTypes: ['multiple_choice'] },
    { id: 'closing', label: '決算整理', uiTypes: ['multiple_choice', 'calculation'] },
  ],
  systemPrompt: `あなたは日商簿記3級の問題作成専門家です。日本商工会議所の簿記検定に準拠した入門〜基礎レベルの問題を作成します。小規模個人企業の簿記に関する問題を作成してください。`,
  promptGuidelines: `
- 簿記初心者にも理解できる問題文にしてください
- 仕訳問題は現金・売掛金・買掛金など基本的な勘定科目を使ってください
- 計算問題は1〜2ステップで解ける問題にしてください
- 解説には勘定科目の意味も含めて説明してください`,
  description: '個人商店レベルの簿記入門資格。社会人・学生問わず人気で、経理・会計への第一歩として最適。',
  examInfo: {
    fee: '¥2,850',
    schedule: '年3回（2月・6月・11月）',
    passRate: '約40〜50%',
    officialUrl: 'https://www.kentei.ne.jp/bookkeeping',
  },
};
