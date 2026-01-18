# ルーティング構成リファクタリング仕様書

## 1. 目的 / ゴール

HonoXのルーティングパターンを統一し、コードの一貫性と保守性を向上させる。

参考リポジトリ（my_manga_update_notifier）と同じく、全てのルートで `createRoute` パターンを使用する。

---

## 2. スコープ

### やること
- `new Hono()` パターンを使用しているルートファイルを `createRoute` パターンに変換
- 対象ファイル:
  1. `app/routes/items/new.tsx`
  2. `app/routes/api/items/index.ts`
  3. `app/routes/api/items/[id].ts`

### やらないこと
- 既に `createRoute` を使用しているファイルの変更
- ビジネスロジックの変更
- UIの変更
- 新機能の追加

---

## 3. 変更対象ファイル

| ファイル | 現在のパターン | 変更内容 |
|---------|--------------|---------|
| `routes/items/new.tsx` | `new Hono()` | `createRoute` に変換 |
| `routes/api/items/index.ts` | `new Hono()` | `createRoute` に変換 |
| `routes/api/items/[id].ts` | `new Hono()` | `createRoute` に変換 |

---

## 4. 変換パターン

### 4.1 ページルート（GET + POST）

**Before (`new Hono()`):**
```typescript
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => { ... })
app.post('/', async (c) => { ... })

export default app
```

**After (`createRoute`):**
```typescript
import { createRoute } from 'honox/factory'

export default createRoute((c) => { ... })  // GET
export const POST = createRoute(async (c) => { ... })
```

### 4.2 APIルート（複数HTTPメソッド）

**Before (`new Hono()`):**
```typescript
import { Hono } from 'hono'
const app = new Hono()

app.get('/', async (c) => { ... })
app.post('/', async (c) => { ... })
app.put('/', async (c) => { ... })
app.delete('/', async (c) => { ... })

export default app
```

**After (`createRoute`):**
```typescript
import { createRoute } from 'honox/factory'

export const GET = createRoute(async (c) => { ... })
export const POST = createRoute(async (c) => { ... })
export const PUT = createRoute(async (c) => { ... })
export const DELETE = createRoute(async (c) => { ... })
```

---

## 5. 非機能要件

- 既存の機能は全て維持される
- APIのレスポンス形式は変更しない
- フォームのバリデーションロジックは変更しない

---

## 6. 受け入れ条件（Acceptance Criteria）

1. [ ] 全てのルートファイルが `createRoute` パターンを使用している
2. [ ] `npm run dev` でエラーなく起動できる
3. [ ] 以下の機能が正常に動作する:
   - アイテム一覧表示（GET /）
   - アイテム新規作成（GET/POST /items/new）
   - アイテム詳細表示（GET /items/:id）
   - アイテム編集（GET/POST /items/:id/edit）
   - アイテム削除（POST /items/:id/delete）
   - API: GET /api/items
   - API: POST /api/items
   - API: GET /api/items/:id
   - API: PUT /api/items/:id
   - API: DELETE /api/items/:id
4. [ ] TypeScriptの型エラーがない

---

## 7. リスク・注意点

- HonoXのファイルベースルーティングでは、`createRoute`を使用する際のHTTPメソッドのエクスポート名が重要
- APIルートの場合、`export default`ではなく`export const GET/POST/PUT/DELETE`を使用する
