import { QualificationConfig } from '../types';

export const kihonJohoConfig: QualificationConfig = {
  slug: 'kihon-joho',
  name: '基本情報技術者',
  nameShort: '基本情報',
  genre: 'it',
  defaultUITypes: ['multiple_choice'],
  categories: [
    { id: 'computer-science', label: 'コンピュータ科学基礎', uiTypes: ['multiple_choice'] },
    { id: 'algorithm', label: 'アルゴリズムとデータ構造', uiTypes: ['multiple_choice'] },
    { id: 'software', label: 'ソフトウェア', uiTypes: ['multiple_choice'] },
    { id: 'hardware', label: 'ハードウェア', uiTypes: ['multiple_choice'] },
    { id: 'network', label: 'ネットワーク', uiTypes: ['multiple_choice'] },
    { id: 'security', label: 'セキュリティ', uiTypes: ['multiple_choice'] },
    { id: 'database', label: 'データベース', uiTypes: ['multiple_choice'] },
    { id: 'management', label: 'マネジメント系', uiTypes: ['multiple_choice'] },
    { id: 'strategy', label: 'ストラテジ系', uiTypes: ['multiple_choice'] },
  ],
  systemPrompt: `あなたは基本情報技術者試験の問題作成専門家です。IPA（情報処理推進機構）が公開している試験シラバスに準拠した問題を作成します。問題は実際の試験と同等の品質・難易度で作成してください。`,
  promptGuidelines: `
- 選択肢は必ず4つで、正解は1つです
- 選択肢の長さはなるべく均等にしてください
- 専門用語は正確に使用し、略語には初出時に正式名称を記載
- 難易度1〜2: 基本概念の定義・用語問題
- 難易度3: 概念の応用・計算問題
- 難易度4〜5: 複合的な知識が必要な問題・午後試験レベル`,
  difficultyLabels: {
    1: '入門',
    2: '基本',
    3: '標準',
    4: '応用',
    5: '午後試験レベル',
  },
  description: 'ITエンジニアの登竜門。アルゴリズム・ネットワーク・DB・セキュリティなどITの基礎を幅広く問う国家試験。',
  examInfo: {
    fee: '¥7,500',
    schedule: '通年（CBT方式）',
    passRate: '約40〜45%',
    officialUrl: 'https://www.ipa.go.jp/shiken/kubun/fe.html',
  },
};
