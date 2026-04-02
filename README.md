# 資格マスター

AI が問題を無限生成する日本語資格勉強アプリ。Claude API（Haiku）を活用し、「問題が尽きない」学習体験を実現します。

## 主な機能

- **AI 問題生成** — Claude Haiku が 5 種類の出題形式で問題を自動生成
  - 4 択問題 / ○×問題 / 穴埋め問題 / 計算問題 / 複数選択問題
- **16 資格に対応**（Phase 1）
  - IT 系: ITパスポート・基本情報技術者・応用情報技術者
  - ビジネス系: 簿記 2 級・簿記 3 級・FP 2 級・FP 3 級
  - 語学系: 英検 準1級・2級・準2級・3級・TOEIC
  - 医療系: 登録販売者・介護福祉士
  - 法律系: 宅建士・行政書士
- **学習セッション管理** — 問題数・難易度を選択して開始
- **適性診断** — おすすめ資格を診断
- **学習統計** — MyPage で学習履歴を確認
- **プッシュ通知** — 学習リマインダー

## Tech Stack

| カテゴリ | 技術 |
|---|---|
| フレームワーク | React Native + Expo SDK 55 |
| ルーティング | Expo Router (ファイルベース) |
| バックエンド | Supabase (Auth / PostgreSQL) |
| AI 問題生成 | Claude API (`claude-haiku-4-5-20251001`) |
| Edge Functions | Supabase Edge Functions (Deno) |
| 状態管理 | Zustand |
| バリデーション | Zod |
| 課金 (予定) | RevenueCat |

## アーキテクチャ

```
[Expo アプリ]
    ↓ HTTPS
[Supabase Edge Function: generate-questions]
    ├─ キャッシュ確認 (PostgreSQL)
    ├─ クォータ管理
    └─ Claude API (Haiku) → 問題 JSON 生成
```

## セットアップ

### 前提条件

- Node.js 18+
- Expo CLI
- Supabase CLI
- Anthropic API キー

### 手順

```bash
# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env
# .env を編集して各キーを入力

# Supabase マイグレーション実行
supabase db push

# Edge Function デプロイ
supabase functions deploy generate-questions

# アプリ起動
npx expo start
```

### 環境変数

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## ディレクトリ構成

```
├── app/                    # Expo Router 画面
│   ├── (tabs)/             # タブ画面（ホーム・マイページ・設定）
│   ├── session/            # 学習セッション（問題・結果）
│   ├── qualification/      # 資格追加
│   └── auth/               # 認証
├── src/
│   ├── components/         # UI コンポーネント
│   ├── config/qualifications/  # 資格設定ファイル
│   ├── services/           # Supabase サービス
│   ├── stores/             # Zustand ストア
│   ├── types/              # TypeScript 型定義
│   └── utils/              # ユーティリティ
└── supabase/
    ├── functions/          # Edge Functions
    └── migrations/         # DB マイグレーション
```

## ライセンス

MIT
