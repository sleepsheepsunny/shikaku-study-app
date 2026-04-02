import { Question } from '@/types/question';

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'mock-1',
    qualification_id: 'mock',
    category: 'ネットワーク',
    difficulty: 2,
    ui_type: 'multiple_choice',
    question_text: 'OSI参照モデルの第3層（ネットワーク層）の役割として最も適切なものはどれか？',
    question_data: {
      ui_type: 'multiple_choice',
      choices: [
        { id: 'A', text: 'データの物理的な伝送を担当する' },
        { id: 'B', text: 'IPアドレスを使ってデータの経路制御を行う' },
        { id: 'C', text: 'アプリケーション間の通信を管理する' },
        { id: 'D', text: 'エラー検出・訂正とフロー制御を行う' },
      ],
      answer: 'B',
      explanation:
        '第3層（ネットワーク層）はIPアドレスを使ったルーティング（経路制御）を担当します。A=第1層（物理層）、C=第7層（アプリケーション層）、D=第2層（データリンク層）の役割です。',
    },
    generated_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    qualification_id: 'mock',
    category: 'セキュリティ',
    difficulty: 3,
    ui_type: 'true_false',
    question_text:
      'SQLインジェクション攻撃は、Webアプリケーションのフォーム入力に悪意のあるSQL文を埋め込み、データベースを不正に操作する攻撃手法である。',
    question_data: {
      ui_type: 'true_false',
      choices: [
        { id: 'true', text: '○（正しい）' },
        { id: 'false', text: '×（誤り）' },
      ],
      answer: true,
      explanation:
        '正しいです。SQLインジェクションはOWASP Top 10にも含まれる代表的な攻撃手法で、入力値のサニタイズやプリペアドステートメントの使用で対策できます。',
    },
    generated_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    qualification_id: 'mock',
    category: 'アルゴリズム',
    difficulty: 3,
    ui_type: 'multiple_choice',
    question_text:
      'n個のデータに対してバブルソートを行う場合の最悪時間計算量はどれか？',
    question_data: {
      ui_type: 'multiple_choice',
      choices: [
        { id: 'A', text: 'O(n)' },
        { id: 'B', text: 'O(n log n)' },
        { id: 'C', text: 'O(n²)' },
        { id: 'D', text: 'O(log n)' },
      ],
      answer: 'C',
      explanation:
        'バブルソートの最悪計算量はO(n²)です。n個の要素に対して最大n-1回のパスが必要で、各パスで最大n-1回の比較が発生します。クイックソートの平均はO(n log n)です。',
    },
    generated_at: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    qualification_id: 'mock',
    category: '金融資産運用',
    difficulty: 3,
    ui_type: 'calculation',
    question_text:
      '元本100万円を年利4%の単利で3年間運用した場合の元利合計はいくらか？',
    question_data: {
      ui_type: 'calculation',
      answer: 112,
      answer_unit: '万円',
      answer_precision: 0,
      explanation:
        '単利の計算式: 元本 × (1 + 利率 × 期間)\n= 100 × (1 + 0.04 × 3)\n= 100 × 1.12\n= 112万円',
    },
    generated_at: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    qualification_id: 'mock',
    category: 'Part 5: 文法・語彙',
    difficulty: 2,
    ui_type: 'fill_blank',
    question_text:
      'Choose the word that best completes the sentence:\n\n"The project manager asked all team members to submit their reports ______ Friday."',
    question_data: {
      ui_type: 'fill_blank',
      choices: [
        { id: 'A', text: 'until' },
        { id: 'B', text: 'by' },
        { id: 'C', text: 'since' },
        { id: 'D', text: 'during' },
      ],
      answer: 'B',
      blank_hint: '期限を表す前置詞',
      explanation:
        '"by" は「〜までに（期限）」を表します。"until" は「〜まで（継続）」なので不可。\n正解: by Friday = 金曜日までに（提出完了）',
    },
    generated_at: new Date().toISOString(),
  },
  {
    id: 'mock-6',
    qualification_id: 'mock',
    category: 'セキュリティ',
    difficulty: 4,
    ui_type: 'multi_select',
    question_text:
      '情報セキュリティの三要素（CIA）として正しいものを2つ選んでください。',
    question_data: {
      ui_type: 'multi_select',
      choices: [
        { id: 'A', text: '機密性（Confidentiality）' },
        { id: 'B', text: '互換性（Compatibility）' },
        { id: 'C', text: '完全性（Integrity）' },
        { id: 'D', text: '接続性（Connectivity）' },
      ],
      answer: ['A', 'C'],
      explanation:
        'CIAトライアングルは「機密性（Confidentiality）」「完全性（Integrity）」「可用性（Availability）」の3つです。B・Dはセキュリティの三要素には含まれません。',
    },
    generated_at: new Date().toISOString(),
  },
];
