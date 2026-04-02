import { QualificationConfig } from '../types';

export const itPassportConfig: QualificationConfig = {
  slug: 'it-passport',
  name: 'ITパスポート',
  nameShort: 'ITパスポート',
  genre: 'it',
  defaultUITypes: ['multiple_choice'],
  categories: [
    { id: 'strategy', label: 'ストラテジ系', uiTypes: ['multiple_choice'] },
    { id: 'management', label: 'マネジメント系', uiTypes: ['multiple_choice'] },
    { id: 'technology', label: 'テクノロジ系', uiTypes: ['multiple_choice'] },
    { id: 'ai-data', label: 'AIとデータ活用', uiTypes: ['multiple_choice'] },
    { id: 'security', label: 'セキュリティ', uiTypes: ['multiple_choice'] },
  ],
  systemPrompt: `あなたはITパスポート試験の問題作成専門家です。IPA（情報処理推進機構）が公開している試験シラバスに準拠した問題を作成します。ITの基礎知識・ビジネス活用・DXに関する問題を作成してください。`,
  promptGuidelines: `
- 選択肢は必ず4つで、正解は1つです
- IT初学者を対象とした分かりやすい問題文にしてください
- 難易度1〜2: IT用語・基本概念の問題
- 難易度3〜4: ビジネス活用・データ分析・AIに関する問題
- 難易度5: 複合的な知識を問う応用問題`,
  difficultyLabels: {
    1: '入門',
    2: '基本',
    3: '標準',
    4: '応用',
    5: 'ハイレベル',
  },
  description: 'IT社会の必須知識を問うエントリー資格。AI・DX・セキュリティを含むIT全般の基礎が身につく。',
  examInfo: {
    fee: '¥7,500',
    schedule: '通年（CBT方式）',
    passRate: '約50〜55%',
    officialUrl: 'https://www.ipa.go.jp/shiken/kubun/ip.html',
  },
};
