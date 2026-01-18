# My Wardrobe Deck

カードデッキのように洋服を俯瞰して管理するワードローブ管理アプリです。

## 概要

洋服をカテゴリ別にカード形式で表示し、手持ちのアイテムを一覧管理できます。hotel-uro.jp を参考にした落ち着いたハイセンスなデザインを採用しています。

## 機能

- **カテゴリ別一覧表示**: アウター・トップス・ボトムス・シューズ・アクセサリーの5分類
- **CRUD操作**: アイテムの作成・閲覧・編集・削除
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | [HonoX](https://github.com/honojs/honox) |
| ランタイム | [Cloudflare Workers](https://workers.cloudflare.com/) |
| データベース | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) |
| スタイリング | [Tailwind CSS](https://tailwindcss.com/) |
| バリデーション | [Zod](https://zod.dev/) |
| テスト | [Vitest](https://vitest.dev/) |
| 言語 | TypeScript |

## 必要要件

- Node.js 18+
- npm または pnpm
- Wrangler CLI（Cloudflareデプロイ用）

## セットアップ

```bash
# 依存関係のインストール
npm install

# D1データベースの作成（初回のみ）
npx wrangler d1 create my-wardrobe-deck-db

# マイグレーション実行（ローカル）
npx wrangler d1 execute my-wardrobe-deck-db --local --file=migrations/0001_create_items.sql
```

## 開発

```bash
# 開発サーバー起動
npm run dev

# テスト実行
npm run test

# ビルド
npm run build

# プレビュー（ローカルでCloudflare環境をエミュレート）
npm run preview
```

開発サーバー起動後、http://localhost:5173 でアクセスできます。

## プロジェクト構造

```
my-wardrobe-deck/
├── app/
│   ├── routes/           # ページ・APIルート
│   │   ├── index.tsx     # ホーム（カテゴリ別一覧）
│   │   ├── items/        # アイテムCRUD画面
│   │   └── api/          # REST API
│   ├── components/       # UIコンポーネント
│   │   ├── ui/           # Button, Card, Input等
│   │   ├── layout/       # Header, Footer
│   │   └── items/        # ItemCard, ItemForm等
│   ├── db/               # D1データベースアクセス層
│   ├── lib/              # 定数・バリデーション
│   └── types/            # 型定義
├── tests/                # テストファイル
├── migrations/           # D1マイグレーション
└── .plan/                # 設計ドキュメント・開発ログ
```

## API

### アイテム

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/items` | 全アイテム取得 |
| GET | `/api/items?category={category}` | カテゴリ別取得 |
| GET | `/api/items/:id` | アイテム詳細取得 |
| POST | `/api/items` | アイテム作成 |
| PUT | `/api/items/:id` | アイテム更新 |
| DELETE | `/api/items/:id` | アイテム削除 |

## デプロイ

```bash
# 本番D1データベースにマイグレーション実行
npx wrangler d1 execute my-wardrobe-deck-db --file=migrations/0001_create_items.sql

# Cloudflare Pagesにデプロイ
npm run deploy
```

## 開発ステータス

- [x] Phase 0: 環境セットアップ
- [x] Phase 1: データベース・モデル層
- [x] Phase 2: API/バックエンド
- [x] Phase 3: フロントエンド（一覧・カード表示）
- [x] Phase 4: フロントエンド（CRUD画面）
- [ ] Phase 5: 簡易認証
- [ ] Phase 6: 最終調整・デプロイ

詳細な設計・進捗は `.plan/` ディレクトリを参照してください。

## ライセンス

MIT
