import { QualificationConfig } from '../types';

export const fp2Config: QualificationConfig = {
  slug: 'fp-2',
  name: 'FP技能士2級',
  nameShort: 'FP2級',
  genre: 'business',
  defaultUITypes: ['multiple_choice', 'calculation'],
  categories: [
    { id: 'life-planning', label: 'ライフプランニング', uiTypes: ['multiple_choice'] },
    { id: 'risk-management', label: 'リスク管理（保険）', uiTypes: ['multiple_choice'] },
    { id: 'financial-assets', label: '金融資産運用', uiTypes: ['multiple_choice', 'calculation'] },
    { id: 'tax', label: 'タックスプランニング', uiTypes: ['multiple_choice', 'calculation'] },
    { id: 'real-estate', label: '不動産', uiTypes: ['multiple_choice', 'calculation'] },
    { id: 'estate-planning', label: '相続・事業承継', uiTypes: ['multiple_choice', 'calculation'] },
  ],
  systemPrompt: `あなたはFP（ファイナンシャルプランニング）技能士2級の問題作成専門家です。日本FP協会・金融財政事情研究会の試験に準拠した問題を作成します。`,
  promptGuidelines: `
- 税率・保険料率などの数値は実際の試験で使われる数値に近い値を使ってください
- 計算問題は手順が明確で解説で計算式を示してください
- 法改正がある分野（税制など）は保守的な設定にしてください
- 難易度4〜5では複数分野をまたぐ複合問題を作成してください`,
  description: 'ライフプランから税・不動産・相続まで網羅するお金の専門家資格。FP3級の上位で就職・転職に強い。',
  examInfo: {
    fee: '¥8,700（学科）/ ¥8,700（実技）',
    schedule: '年3回（1月・5月・9月）',
    passRate: '約40〜60%',
    officialUrl: 'https://www.jafp.or.jp/exam/',
  },
};
