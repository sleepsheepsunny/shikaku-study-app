import { QualificationConfig } from '../types';

export const toeicConfig: QualificationConfig = {
  slug: 'toeic',
  name: 'TOEIC L&R',
  nameShort: 'TOEIC',
  genre: 'language',
  defaultUITypes: ['multiple_choice', 'fill_blank'],
  categories: [
    { id: 'part5-grammar', label: 'Part 5: 文法・語彙', uiTypes: ['fill_blank'] },
    { id: 'part6-text', label: 'Part 6: 長文穴埋め', uiTypes: ['fill_blank'] },
    { id: 'part7-reading', label: 'Part 7: 読解', uiTypes: ['multiple_choice'] },
    { id: 'business-vocab', label: 'ビジネス英語語彙', uiTypes: ['multiple_choice', 'fill_blank'] },
  ],
  systemPrompt: `あなたはTOEIC L&R（Listening & Reading Test）の問題作成専門家です。ETS（Educational Testing Service）のTOEIC試験形式に準拠した問題を作成します。ビジネスシーンを題材にした英語問題を作成してください。`,
  promptGuidelines: `
- 問題文・選択肢は英語で書いてください
- 解説は日本語で書いてください
- Part 5形式: 1文の穴埋め問題（文法・語彙）
- Part 6形式: メール・お知らせなどのビジネス文書の穴埋め
- Part 7形式: ビジネスEメール・告知・記事からの読解
- ビジネス英語特有の表現・イディオムを積極的に使用してください
- スコア帯の目安: 難易度1-2=600点以下, 3=700点, 4=800点, 5=900点以上`,
  description: 'ビジネス英語の国際標準テスト。就活・昇進に900点以上を目指す社会人に最も人気の英語資格。',
  examInfo: {
    fee: '¥7,810',
    schedule: '月1〜2回（公開テスト）',
    passRate: '合否なし（スコア制）',
    officialUrl: 'https://www.iibc-global.org/toeic.html',
  },
};
