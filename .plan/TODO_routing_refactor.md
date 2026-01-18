# ルーティング構成リファクタリング TODO

## Phase 0: 準備

### 目的
現在の動作を確認し、リファクタリング後の比較基準を作る

### 作業内容
- [ ] 開発サーバーが正常に起動することを確認
- [ ] 既存機能の動作確認

### 完了条件
- 開発サーバーが起動する
- 基本的な機能が動作することを確認

---

## Phase 1: items/new.tsx の変換

### 目的
ページルート（GET + POST）を `createRoute` パターンに変換

### 作業内容
- [ ] `new Hono()` → `createRoute` パターンに変換
- [ ] GET: `export default createRoute(...)`
- [ ] POST: `export const POST = createRoute(...)`
- [ ] 動作確認

### 変更対象
- `app/routes/items/new.tsx`

### 完了条件
- `/items/new` でフォームが表示される
- フォーム送信でアイテムが作成される
- バリデーションエラー時にエラー表示される

---

## Phase 2: api/items/index.ts の変換

### 目的
APIルート（GET + POST）を `createRoute` パターンに変換

### 作業内容
- [ ] `new Hono()` → `createRoute` パターンに変換
- [ ] GET: `export const GET = createRoute(...)`
- [ ] POST: `export const POST = createRoute(...)`
- [ ] 動作確認

### 変更対象
- `app/routes/api/items/index.ts`

### 完了条件
- `GET /api/items` でアイテム一覧が取得できる
- `POST /api/items` でアイテムが作成できる

---

## Phase 3: api/items/[id].ts の変換

### 目的
APIルート（GET + PUT + DELETE）を `createRoute` パターンに変換

### 作業内容
- [ ] `new Hono()` → `createRoute` パターンに変換
- [ ] GET: `export const GET = createRoute(...)`
- [ ] PUT: `export const PUT = createRoute(...)`
- [ ] DELETE: `export const DELETE = createRoute(...)`
- [ ] 動作確認

### 変更対象
- `app/routes/api/items/[id].ts`

### 完了条件
- `GET /api/items/:id` でアイテム取得できる
- `PUT /api/items/:id` でアイテム更新できる
- `DELETE /api/items/:id` でアイテム削除できる

---

## Phase 4: 最終確認

### 目的
全体の動作確認とコード品質チェック

### 作業内容
- [ ] TypeScriptエラーがないことを確認
- [ ] 全機能の動作確認
- [ ] コードの一貫性確認

### 完了条件
- 受け入れ条件が全て満たされている
