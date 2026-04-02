import { QualificationConfig } from '../types';

export const boki2Config: QualificationConfig = {
  slug: 'boki-2',
  name: '日商簿記2級',
  nameShort: '簿記2級',
  genre: 'business',
  defaultUITypes: ['multiple_choice', 'calculation'],
  categories: [
    { id: 'commercial-bookkeeping', label: '商業簿記', uiTypes: ['multiple_choice', 'calculation'] },
    { id: 'industrial-bookkeeping', label: '工業簿記', uiTypes: ['multiple_choice', 'calculation'] },
    { id: 'financial-statements', label: '財務諸表', uiTypes: ['multiple_choice', 'calculation'] },
    { id: 'cost-accounting', label: '原価計算', uiTypes: ['calculation'] },
    { id: 'journal-entries', label: '仕訳', uiTypes: ['multiple_choice'] },
  ],
  systemPrompt: `あなたは日商簿記2級の問題作成専門家です。日本商工会議所の簿記検定に準拠した問題を作成します。商業簿記・工業簿記・財務諸表・原価計算に関する問題を作成してください。`,
  promptGuidelines: `
- 仕訳問題は借方・貸方の科目と金額を問う4択形式にしてください
- 計算問題は数値を求める形式で、answer_unitに単位（円、%など）を必ず記載してください
- 解説には計算過程を詳しく記載してください
- 難易度3以上では複数の取引が絡む複合問題を作成してください`,
  description: '商業簿記・工業簿記を扱う中級資格。経理・財務職への転職で高評価。年商数億円規模の会計実務に直結。',
  examInfo: {
    fee: '¥4,720',
    schedule: '年3回（2月・6月・11月）',
    passRate: '約20〜30%',
    officialUrl: 'https://www.kentei.ne.jp/bookkeeping',
  },
};
