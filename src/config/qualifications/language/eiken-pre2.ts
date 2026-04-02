import { QualificationConfig } from '../types';

export const eikenPre2Config: QualificationConfig = {
  slug: 'eiken-pre2',
  name: '英検準2級',
  nameShort: '英検準2級',
  genre: 'language',
  defaultUITypes: ['multiple_choice', 'fill_blank'],
  categories: [
    { id: 'vocabulary', label: '語彙・熟語', uiTypes: ['multiple_choice'] },
    { id: 'grammar', label: '文法', uiTypes: ['multiple_choice', 'fill_blank'] },
    { id: 'reading', label: '読解', uiTypes: ['multiple_choice'] },
    { id: 'dialogue', label: '会話文', uiTypes: ['multiple_choice', 'fill_blank'] },
  ],
  systemPrompt: `あなたは英検準2級（公益財団法人日本英語検定協会）の問題作成専門家です。高校基礎〜中級レベルの英語問題を作成します。`,
  promptGuidelines: `
- 高校英語レベル（高校在学程度）の語彙・文法を使用してください
- 問題文・選択肢は英語で書いてください
- 解説は日本語で書いてください
- 社会的な話題（環境・技術・文化）も含めてください`,
  description: '高校在学程度の英語力を証明。3級と2級の間でバランスよく力をつけたい方に人気の資格。',
  examInfo: {
    fee: '¥8,500（一次）',
    schedule: '年3回（6月・10月・1月）',
    passRate: '約55〜60%',
    officialUrl: 'https://www.eiken.or.jp/eiken/exam/',
  },
};
