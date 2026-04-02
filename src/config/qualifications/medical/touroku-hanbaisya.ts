import { QualificationConfig } from '../types';

export const tourokuHanbaisyaConfig: QualificationConfig = {
  slug: 'touroku-hanbaisya',
  name: '登録販売者',
  nameShort: '登録販売者',
  genre: 'medical',
  defaultUITypes: ['multiple_choice'],
  categories: [
    { id: 'medicine-work', label: '医薬品に共通する特性と基本的な知識', uiTypes: ['multiple_choice'] },
    { id: 'human-body', label: '人体の働きと医薬品', uiTypes: ['multiple_choice'] },
    { id: 'otc-drugs', label: '主な医薬品とその作用', uiTypes: ['multiple_choice'] },
    { id: 'drug-sales', label: '薬事関係法規・制度', uiTypes: ['multiple_choice'] },
    { id: 'drug-guidance', label: '医薬品の適正使用・安全対策', uiTypes: ['multiple_choice'] },
  ],
  systemPrompt: `あなたは登録販売者試験の問題作成専門家です。厚生労働省が定める「試験問題の作成に関する手引き」に準拠した問題を作成します。一般用医薬品（OTC医薬品）に関する問題を作成してください。`,
  promptGuidelines: `
- 選択肢は必ず5つで、正解は1つです
- 一般用医薬品の成分名・効能・副作用に関する問題を中心に作成してください
- 薬事法・医薬品医療機器等法（薬機法）に基づいた問題を含めてください
- 「正しいもの」「誤っているもの」の表現を使い分けてください
- 解説では薬理作用の根拠も含めて説明してください`,
  description: 'ドラッグストアで第2類・第3類医薬品を販売できる公的資格。医療・流通両方で活かせる将来性の高い資格。',
  examInfo: {
    fee: '¥12,800〜18,100（都道府県により異なる）',
    schedule: '年1回（8〜12月、都道府県別）',
    passRate: '約40〜50%',
    officialUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iyakuhin/haichi_yakuzaishi/',
  },
};
