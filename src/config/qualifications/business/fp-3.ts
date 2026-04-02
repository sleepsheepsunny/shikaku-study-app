import { QualificationConfig } from '../types';

export const fp3Config: QualificationConfig = {
  slug: 'fp-3',
  name: 'FP技能士3級',
  nameShort: 'FP3級',
  genre: 'business',
  defaultUITypes: ['multiple_choice', 'true_false'],
  categories: [
    { id: 'life-planning', label: 'ライフプランニング', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'risk-management', label: 'リスク管理（保険）', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'financial-assets', label: '金融資産運用', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'tax', label: 'タックスプランニング', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'real-estate', label: '不動産', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'estate-planning', label: '相続', uiTypes: ['multiple_choice', 'true_false'] },
  ],
  systemPrompt: `あなたはFP（ファイナンシャルプランニング）技能士3級の問題作成専門家です。入門〜基礎レベルのFPの知識を問う問題を作成します。`,
  promptGuidelines: `
- 3択または○×問題が中心です
- 身近なお金の話（保険・税金・貯蓄）に関連付けた問題にしてください
- 専門用語には簡単な説明を問題文内に含めてください
- 難易度1〜3の問題を中心に作成してください`,
  description: '家計管理・保険・税金の基礎を学ぶお金の入門資格。社会人に特に人気で誰でも受験可能。',
  examInfo: {
    fee: '¥6,000（学科）/ ¥6,000（実技）',
    schedule: '年3回（1月・5月・9月）',
    passRate: '約70〜80%',
    officialUrl: 'https://www.jafp.or.jp/exam/',
  },
};
