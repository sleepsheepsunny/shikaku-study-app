import { QualificationConfig } from '../types';

export const gyoseiShoshiConfig: QualificationConfig = {
  slug: 'gyosei-shoshi',
  name: '行政書士',
  nameShort: '行政書士',
  genre: 'legal',
  defaultUITypes: ['multiple_choice', 'true_false', 'multi_select'],
  categories: [
    { id: 'administrative-law', label: '行政法', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'civil-law', label: '民法', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'constitutional-law', label: '憲法', uiTypes: ['multiple_choice', 'true_false'] },
    { id: 'commercial-law', label: '商法・会社法', uiTypes: ['multiple_choice'] },
    { id: 'general-knowledge', label: '一般知識', uiTypes: ['multiple_choice', 'multi_select'] },
    { id: 'administrative-procedure', label: '行政手続法・審査請求', uiTypes: ['multiple_choice', 'true_false'] },
  ],
  systemPrompt: `あなたは行政書士試験の問題作成専門家です。総務省が実施する行政書士試験に準拠した問題を作成します。行政法・民法・憲法・商法に関する高度な法律問題を作成してください。`,
  promptGuidelines: `
- 選択肢は必ず5つで、正解は1つです（複数選択を除く）
- 条文の正確な解釈・判例に基づいた問題を作成してください
- 「正しいもの」「誤っているもの」「適切でないもの」を明確に指定してください
- 解説では根拠条文・重要判例を引用してください
- 難易度4〜5では判例の細かい内容・例外規定を問う問題を作成してください`,
  description: '行政手続き・許認可申請の法律専門家。法律系資格の中でも取得しやすく独立開業への近道となる資格。',
  examInfo: {
    fee: '¥7,000',
    schedule: '年1回（11月）',
    passRate: '約10〜15%',
    officialUrl: 'https://gyosei-shiken.or.jp/',
  },
};
