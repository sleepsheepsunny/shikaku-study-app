import { QualificationConfig } from '../types';

export const eikenPre1Config: QualificationConfig = {
  slug: 'eiken-pre1',
  name: '英検準1級',
  nameShort: '英検準1級',
  genre: 'language',
  defaultUITypes: ['multiple_choice', 'fill_blank'],
  categories: [
    { id: 'vocabulary', label: '語彙・熟語', uiTypes: ['multiple_choice'] },
    { id: 'grammar', label: '文法・語法', uiTypes: ['multiple_choice', 'fill_blank'] },
    { id: 'reading', label: '読解', uiTypes: ['multiple_choice'] },
    { id: 'dialogue', label: '会話文', uiTypes: ['multiple_choice', 'fill_blank'] },
  ],
  systemPrompt: `あなたは英検準1級（公益財団法人日本英語検定協会）の問題作成専門家です。大学中級レベル・CEFR B2相当の英語問題を作成します。`,
  promptGuidelines: `
- 大学中級程度の高度な語彙・複雑な文法構造を使用してください
- 問題文・選択肢は英語で書いてください
- 解説は日本語で書いてください
- アカデミックな話題・専門的な内容を扱う問題を含めてください
- 語彙問題ではC1レベル相当の単語も使用してください`,
  description: '大学中級（CEFR B2）相当の高度な英語力の証明。英語を武器にしたい社会人・大学生の目標資格。',
  examInfo: {
    fee: '¥13,800（一次）',
    schedule: '年3回（6月・10月・1月）',
    passRate: '約15〜20%',
    officialUrl: 'https://www.eiken.or.jp/eiken/exam/',
  },
};
