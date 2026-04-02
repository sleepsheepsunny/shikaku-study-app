import { QualificationConfig } from '../types';

export const eiken2Config: QualificationConfig = {
  slug: 'eiken-2',
  name: '英検2級',
  nameShort: '英検2級',
  genre: 'language',
  defaultUITypes: ['multiple_choice', 'fill_blank'],
  categories: [
    { id: 'vocabulary', label: '語彙・熟語', uiTypes: ['multiple_choice'] },
    { id: 'grammar', label: '文法', uiTypes: ['multiple_choice', 'fill_blank'] },
    { id: 'reading', label: '読解', uiTypes: ['multiple_choice'] },
    { id: 'dialogue', label: '会話文', uiTypes: ['multiple_choice', 'fill_blank'] },
  ],
  systemPrompt: `あなたは英検2級（公益財団法人日本英語検定協会）の問題作成専門家です。高校卒業〜大学基礎レベルの英語問題を作成します。`,
  promptGuidelines: `
- 高校卒業程度の語彙・文法を使用してください
- 問題文・選択肢は英語で書いてください
- 解説は日本語で書いてください
- 社会問題・時事・学術的な話題を扱う問題を含めてください
- 難易度4〜5では長文読解形式の問題にしてください`,
  description: '高校卒業程度の英語力の証明。大学入試・就活で有利になり、海外旅行・留学の基準にも使われる。',
  examInfo: {
    fee: '¥11,800（一次）',
    schedule: '年3回（6月・10月・1月）',
    passRate: '約25〜35%',
    officialUrl: 'https://www.eiken.or.jp/eiken/exam/',
  },
};
