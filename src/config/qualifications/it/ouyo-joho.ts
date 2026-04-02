import { QualificationConfig } from '../types';

export const ouyoJohoConfig: QualificationConfig = {
  slug: 'ouyo-joho',
  name: '応用情報技術者',
  nameShort: '応用情報',
  genre: 'it',
  defaultUITypes: ['multiple_choice', 'multi_select'],
  categories: [
    { id: 'computer-science', label: 'コンピュータ科学基礎', uiTypes: ['multiple_choice'] },
    { id: 'algorithm', label: 'アルゴリズムとデータ構造', uiTypes: ['multiple_choice', 'multi_select'] },
    { id: 'software', label: 'ソフトウェア', uiTypes: ['multiple_choice'] },
    { id: 'hardware', label: 'ハードウェア', uiTypes: ['multiple_choice'] },
    { id: 'network', label: 'ネットワーク', uiTypes: ['multiple_choice', 'multi_select'] },
    { id: 'security', label: 'セキュリティ', uiTypes: ['multiple_choice', 'multi_select'] },
    { id: 'database', label: 'データベース', uiTypes: ['multiple_choice'] },
    { id: 'system-design', label: 'システム設計・開発', uiTypes: ['multiple_choice', 'multi_select'] },
    { id: 'management', label: 'マネジメント系', uiTypes: ['multiple_choice'] },
    { id: 'strategy', label: 'ストラテジ系', uiTypes: ['multiple_choice'] },
  ],
  systemPrompt: `あなたは応用情報技術者試験の問題作成専門家です。IPA（情報処理推進機構）が公開している試験シラバスに準拠した、高度な問題を作成します。基本情報技術者試験より深い技術理解を問う問題を作成してください。`,
  promptGuidelines: `
- 4択問題と複数正解問題（2〜3個正解）を適切に組み合わせてください
- 概念の説明だけでなく、設計・応用・トレードオフを問う問題が多くなるようにしてください
- 難易度4〜5では午後試験の記述式問題に近い複合問題を作成してください
- セキュリティ・ネットワーク・データベースは特に深い知識を問う問題を作成してください`,
  description: '基本情報の上位資格。システム設計・開発・運用の実践力を問う国家試験。エンジニア中級の証明に。',
  examInfo: {
    fee: '¥7,500',
    schedule: '通年（CBT方式）',
    passRate: '約20〜25%',
    officialUrl: 'https://www.ipa.go.jp/shiken/kubun/ap.html',
  },
};
