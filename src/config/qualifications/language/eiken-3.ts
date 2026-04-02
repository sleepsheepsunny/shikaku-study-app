import { QualificationConfig } from '../types';

export const eiken3Config: QualificationConfig = {
  slug: 'eiken-3',
  name: '英検3級',
  nameShort: '英検3級',
  genre: 'language',
  defaultUITypes: ['multiple_choice', 'fill_blank'],
  categories: [
    { id: 'vocabulary', label: '語彙・熟語', uiTypes: ['multiple_choice'] },
    { id: 'grammar', label: '文法', uiTypes: ['multiple_choice', 'fill_blank'] },
    { id: 'reading', label: '読解', uiTypes: ['multiple_choice'] },
    { id: 'dialogue', label: '会話文', uiTypes: ['multiple_choice', 'fill_blank'] },
  ],
  systemPrompt: `あなたは英検3級（公益財団法人日本英語検定協会）の問題作成専門家です。中学英語レベルの語彙・文法・読解問題を作成します。`,
  promptGuidelines: `
- 中学英語レベル（中学3年修了程度）の語彙・文法を使用してください
- 問題文・選択肢は英語で書いてください
- 穴埋め問題は文脈から答えが推測できる自然な英文にしてください
- 解説は日本語で書いてください
- 日常会話・身近な話題を題材にしてください`,
  description: '中学卒業程度の英語力を証明する検定。日常会話の基礎固めに最適な英検入門ステージ。',
  examInfo: {
    fee: '¥6,400（一次）',
    schedule: '年3回（6月・10月・1月）',
    passRate: '約55〜65%',
    officialUrl: 'https://www.eiken.or.jp/eiken/exam/',
  },
};
