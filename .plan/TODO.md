# ワードローブ管理アプリ MVP TODO

## 進捗状況

| フェーズ | 状態 |
|---------|------|
| Phase 0 | 未着手 |
| Phase 1 | 未着手 |
| Phase 2 | 未着手 |
| Phase 3 | 未着手 |
| Phase 4 | 未着手 |
| Phase 5 | 未着手 |
| Phase 6 | 未着手 |

---

## Phase 0: 環境セットアップ

### 目的
HonoXプロジェクトを初期化し、開発・テスト環境を整備する。

### 作業内容

- [ ] HonoXプロジェクト初期化（`npm create hono@latest`）
- [ ] 依存パッケージインストール
  - [ ] hono, honox
  - [ ] zod（バリデーション）
  - [ ] vitest, @cloudflare/vitest-pool-workers（テスト）
  - [ ] tailwindcss, postcss, autoprefixer（スタイリング）
  - [ ] wrangler（Cloudflare CLI）
- [ ] 設定ファイル作成
  - [ ] wrangler.toml（D1設定含む）
  - [ ] vite.config.ts
  - [ ] vitest.config.ts
  - [ ] tailwind.config.js
  - [ ] tsconfig.json調整
- [ ] 基本ディレクトリ構造作成
  - [ ] app/routes/
  - [ ] app/components/
  - [ ] app/db/
  - [ ] app/middleware/
  - [ ] app/lib/
  - [ ] app/types/
  - [ ] tests/
  - [ ] migrations/
- [ ] サンプルテスト作成（Vitest動作確認用）
- [ ] package.json scriptsに dev, build, test 追加

### 変更対象
- 新規ファイル多数（プロジェクト全体の初期化）

### 完了条件
- [ ] `npm run dev` でローカルサーバー起動
- [ ] `npm run test` でテスト実行可能
- [ ] Tailwind CSSが適用される

### ユーザー確認項目
- ローカル環境での動作確認
- ディレクトリ構造の確認

---

## Phase 1: データベース・モデル層

### 目的
D1データベーススキーマとCRUD操作を行うモデル層を実装する。

### 作業内容

- [ ] D1マイグレーションファイル作成（`migrations/0001_create_items.sql`）
- [ ] 型定義作成（`app/types/item.ts`）
  - [ ] Item型
  - [ ] CreateItemInput型
  - [ ] UpdateItemInput型
- [ ] 定数定義（`app/lib/constants.ts`）
  - [ ] CATEGORIES定数
  - [ ] カテゴリ表示名マッピング
- [ ] DBアクセス層実装（`app/db/items.ts`）
  - [ ] getAllItems()
  - [ ] getItemById()
  - [ ] getItemsByCategory()
  - [ ] createItem()
  - [ ] updateItem()
  - [ ] deleteItem()
- [ ] TDD: テストファイル作成（`tests/db/items.test.ts`）
  - [ ] 各CRUD関数のテスト

### 変更対象
- `migrations/0001_create_items.sql`（新規）
- `app/types/item.ts`（新規）
- `app/lib/constants.ts`（新規）
- `app/db/items.ts`（新規）
- `tests/db/items.test.ts`（新規）

### 完了条件
- [ ] マイグレーション実行可能
- [ ] 全CRUDテストがパス

### ユーザー確認項目
- テスト結果の確認
- 型定義の確認

---

## Phase 2: API/バックエンド

### 目的
RESTful APIエンドポイントを実装し、フロントエンドからのCRUD操作を受け付ける。

### 作業内容

- [ ] Zodスキーマ作成（`app/lib/validation.ts`）
  - [ ] createItemSchema
  - [ ] updateItemSchema
- [ ] APIエンドポイント実装
  - [ ] `app/routes/api/items/index.ts`（GET一覧、POST作成）
  - [ ] `app/routes/api/items/[id].ts`（GET詳細、PUT更新、DELETE削除）
- [ ] エラーレスポンスユーティリティ（`app/lib/api-response.ts`）
- [ ] TDD: テストファイル作成（`tests/api/items.test.ts`）
  - [ ] 各エンドポイントのテスト

### 変更対象
- `app/lib/validation.ts`（新規）
- `app/lib/api-response.ts`（新規）
- `app/routes/api/items/index.ts`（新規）
- `app/routes/api/items/[id].ts`（新規）
- `tests/api/items.test.ts`（新規）

### 完了条件
- [ ] 全APIテストがパス
- [ ] curlで各エンドポイント動作確認

### ユーザー確認項目
- curl での動作確認
- エラーハンドリングの確認

---

## Phase 3: フロントエンド（一覧・カード表示）

### 目的
カテゴリ別のカード一覧表示UIを実装する。

### 作業内容

- [ ] 基本UIコンポーネント作成
  - [ ] `app/components/ui/Button.tsx`
  - [ ] `app/components/ui/Card.tsx`
- [ ] レイアウトコンポーネント作成
  - [ ] `app/components/layout/Header.tsx`
  - [ ] `app/components/layout/Footer.tsx`
  - [ ] `app/components/layout/Layout.tsx`
- [ ] アイテムコンポーネント作成
  - [ ] `app/components/items/ItemCard.tsx`
  - [ ] `app/components/items/CategorySection.tsx`
- [ ] ホームページ実装（`app/routes/index.tsx`）
  - [ ] カテゴリ別グルーピング表示
- [ ] Tailwind CSS設定
  - [ ] カスタムカラーパレット設定
  - [ ] フォント設定
- [ ] Font Awesome導入

### 変更対象
- `app/components/ui/Button.tsx`（新規）
- `app/components/ui/Card.tsx`（新規）
- `app/components/layout/Header.tsx`（新規）
- `app/components/layout/Footer.tsx`（新規）
- `app/components/layout/Layout.tsx`（新規）
- `app/components/items/ItemCard.tsx`（新規）
- `app/components/items/CategorySection.tsx`（新規）
- `app/routes/index.tsx`（新規）
- `tailwind.config.js`（更新）

### 完了条件
- [ ] カテゴリ別にカードが表示される
- [ ] レスポンシブ対応（モバイル/タブレット/デスクトップ）
- [ ] hotel-uro.jp風デザインが適用されている

### ユーザー確認項目
- ブラウザでの表示確認
- レスポンシブの動作確認
- デザインの確認

---

## Phase 4: フロントエンド（CRUD画面）

### 目的
アイテムの作成・詳細・編集・削除機能のUIを実装する。

### 作業内容

- [ ] フォームコンポーネント作成
  - [ ] `app/components/ui/Input.tsx`
  - [ ] `app/components/ui/Select.tsx`
  - [ ] `app/components/ui/Textarea.tsx`
  - [ ] `app/components/items/ItemForm.tsx`
- [ ] 新規作成ページ（`app/routes/items/new.tsx`）
- [ ] 詳細ページ（`app/routes/items/[id]/index.tsx`）
- [ ] 編集ページ（`app/routes/items/[id]/edit.tsx`）
- [ ] 削除確認モーダル/処理
- [ ] フォームバリデーション（クライアントサイド）
- [ ] トースト通知コンポーネント（`app/components/ui/Toast.tsx`）

### 変更対象
- `app/components/ui/Input.tsx`（新規）
- `app/components/ui/Select.tsx`（新規）
- `app/components/ui/Textarea.tsx`（新規）
- `app/components/ui/Toast.tsx`（新規）
- `app/components/items/ItemForm.tsx`（新規）
- `app/routes/items/new.tsx`（新規）
- `app/routes/items/[id]/index.tsx`（新規）
- `app/routes/items/[id]/edit.tsx`（新規）

### 完了条件
- [ ] 新規作成が動作する
- [ ] 詳細表示が動作する
- [ ] 編集が動作する
- [ ] 削除が動作する
- [ ] バリデーションエラーが表示される

### ユーザー確認項目
- 全CRUD操作のブラウザ確認
- バリデーションエラー表示の確認

---

## Phase 5: 簡易認証

### 目的
パスワードによる簡易認証を実装し、全ページを保護する。

### 作業内容

- [ ] 認証ミドルウェア作成（`app/middleware/auth.ts`）
  - [ ] セッション確認
  - [ ] 未認証時リダイレクト
- [ ] ログインページ（`app/routes/login.tsx`）
- [ ] 認証API
  - [ ] `app/routes/api/auth/login.ts`
  - [ ] `app/routes/api/auth/logout.ts`
- [ ] セッション管理（Cookie）
- [ ] ログアウトボタン（Headerに追加）
- [ ] TDD: 認証テスト（`tests/middleware/auth.test.ts`）

### 変更対象
- `app/middleware/auth.ts`（新規）
- `app/routes/login.tsx`（新規）
- `app/routes/api/auth/login.ts`（新規）
- `app/routes/api/auth/logout.ts`（新規）
- `app/components/layout/Header.tsx`（更新）
- `tests/middleware/auth.test.ts`（新規）

### 完了条件
- [ ] 未認証時、ログインページにリダイレクト
- [ ] 正しいパスワードでログイン成功
- [ ] ログイン後、セッションが維持される
- [ ] ログアウトで セッション破棄

### ユーザー確認項目
- ログイン/ログアウトの動作確認
- セッション維持の確認

---

## Phase 6: 最終調整・デプロイ

### 目的
全体テストを実行し、Cloudflareへデプロイする。

### 作業内容

- [ ] 全テスト実行・修正
- [ ] リンター・フォーマッター適用
- [ ] 不要コード削除
- [ ] 環境変数設定（本番用パスワードハッシュ等）
- [ ] Cloudflare D1本番DB作成
- [ ] wrangler deploy実行
- [ ] 本番環境動作確認

### 変更対象
- 必要に応じて各種ファイル

### 完了条件
- [ ] 全テストパス
- [ ] 本番環境で全機能動作

### ユーザー確認項目
- 本番URLでの全機能確認

---

## 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2026-01-18 | 初版作成 |
