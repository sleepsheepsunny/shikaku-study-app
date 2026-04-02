import { QualificationConfig } from '../types';

export const takkenConfig: QualificationConfig = {
  slug: 'takken',
  name: '宅地建物取引士',
  nameShort: '宅建',
  genre: 'legal',
  defaultUITypes: ['multiple_choice', 'true_false'],
  categories: [
    { id: 'rights', label: '権利関係（民法等）', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'takken-law', label: '宅建業法', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'legal-restrictions', label: '法令上の制限', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'tax-other', label: '税・その他', uiTypes: ['multiple_choice', 'true_false'] },
  ],
  systemPrompt: `あなたは宅地建物取引士試験の問題作成専門家です。国土交通省が実施する試験に準拠した問題を作成します。不動産取引・宅建業法・民法・都市計画法に関する問題を作成してください。`,
  promptGuidelines: `
- 選択肢は必ず4つで、正解は1つです（○×問題を除く）
- 具体的な不動産取引の事例を問題文に含めてください
- 「正しいもの」「誤っているもの」「適切なもの」を明確に指定してください
- 法律条文の解釈を問う問題を作成してください
- 解説では根拠となる条文・判例を示してください
- ひっかけ問題（似ているが異なる内容）も適度に含めてください`,
  description: '不動産取引の専門家として必須の国家資格。不動産業界への就職・独立開業に必要で年収アップにも直結。',
  examInfo: {
    fee: '¥8,200',
    schedule: '年1回（10月）',
    passRate: '約15〜18%',
    officialUrl: 'https://www.retio.or.jp/',
  },
};
