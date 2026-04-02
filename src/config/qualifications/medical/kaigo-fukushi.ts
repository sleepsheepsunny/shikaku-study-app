import { QualificationConfig } from '../types';

export const kaigoFukushiConfig: QualificationConfig = {
  slug: 'kaigo-fukushi',
  name: '介護福祉士',
  nameShort: '介護福祉士',
  genre: 'medical',
  defaultUITypes: ['multiple_choice'],
  categories: [
    { id: 'human-dignity', label: '人間の尊厳と自立', uiTypes: ['multiple_choice'] },
    { id: 'human-relations', label: '人間関係とコミュニケーション', uiTypes: ['multiple_choice'] },
    { id: 'social-welfare', label: '社会の理解', uiTypes: ['multiple_choice'] },
    { id: 'introduction-care', label: '介護の基本', uiTypes: ['multiple_choice'] },
    { id: 'care-communication', label: 'コミュニケーション技術', uiTypes: ['multiple_choice'] },
    { id: 'life-support', label: '生活支援技術', uiTypes: ['multiple_choice'] },
    { id: 'care-process', label: '介護過程', uiTypes: ['multiple_choice'] },
    { id: 'body-structure', label: 'こころとからだのしくみ', uiTypes: ['multiple_choice'] },
    { id: 'medical-collaboration', label: '医療的ケア', uiTypes: ['multiple_choice'] },
    { id: 'comprehensive', label: '総合問題', uiTypes: ['multiple_choice'] },
  ],
  systemPrompt: `あなたは介護福祉士国家試験の問題作成専門家です。厚生労働省が定める試験基準に準拠した問題を作成します。介護の実践的な場面を想定した問題を作成してください。`,
  promptGuidelines: `
- 選択肢は必ず5つで、正解は1つです（介護福祉士試験は5択）
- 介護現場の具体的な事例を問題文に含めてください
- 「最も適切なもの」「適切でないもの」の表現を使い分けてください
- 倫理的な観点・権利擁護の視点を含む問題も作成してください
- 解説では根拠（法令・ガイドライン・介護の原則）を示してください`,
  description: '介護の専門職として国家資格。介護施設・在宅介護の現場で活躍するための知識・技術を問う。',
  examInfo: {
    fee: '¥18,380',
    schedule: '年1回（1月）',
    passRate: '約70〜80%',
    officialUrl: 'https://www.sssc.or.jp/kaigo/index.html',
  },
};
