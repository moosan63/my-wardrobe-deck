# SPECIFICATION: DDD/CQRS アーキテクチャ リファクタリング

## 1. 目的 / ゴール

my-wardrobe-deck を vakkarma-main のアーキテクチャパターンを参考にして、以下の設計原則に基づきリファクタリングする。

- **DDD（ドメイン駆動設計）** の層構造を導入
- **CQRS（コマンドクエリ責務分離）** パターンを採用
- **Neverthrow** によるResult型エラーハンドリングを導入
- **D1（Cloudflare SQLite）** は維持

### 期待される効果
- ドメインロジックの明確化・カプセル化
- テスタビリティの向上（リポジトリの抽象化）
- 型安全なエラーハンドリング
- 読み取り/書き込み操作の最適化

---

## 2. スコープ

### やること
- DDDの層構造（domain/usecases/repositories）の導入
- CQRS（read/write分離）の実装
- Neverthrowによるエラーハンドリングの統一
- 既存のAPIエンドポイント・SSRページの移行
- テスト構造の再編成

### やらないこと
- データベースの変更（D1 → PostgreSQL）
- UIコンポーネントの変更
- 新機能の追加
- 認証機能の実装（別タスク）

---

## 3. 新アーキテクチャ

### 3.1 ディレクトリ構成

```
app/
├── routes/                    # プレゼンテーション層（変更なし）
├── components/                # UIコンポーネント（変更なし）
│
├── src/                       # ★新規：ドメイン/アプリケーション層
│   └── item/                  # Item集約のBounded Context
│       ├── domain/
│       │   ├── read/          # Read Model (Query側)
│       │   │   └── item-read-model.ts
│       │   ├── write/         # Write Model (Command側)
│       │   │   ├── item.ts              # Itemエンティティ
│       │   │   ├── item-id.ts           # ItemId値オブジェクト
│       │   │   ├── item-name.ts         # ItemName値オブジェクト
│       │   │   ├── category.ts          # Category値オブジェクト
│       │   │   ├── color.ts             # Color値オブジェクト
│       │   │   └── errors.ts            # ドメインエラー型
│       │   └── index.ts
│       ├── repositories/
│       │   ├── item-repository.ts       # Writeリポジトリインターフェース
│       │   └── item-read-repository.ts  # Readリポジトリインターフェース
│       ├── usecases/
│       │   ├── create-item.ts
│       │   ├── update-item.ts
│       │   ├── delete-item.ts
│       │   ├── get-item.ts
│       │   ├── list-items.ts
│       │   └── list-items-by-category.ts
│       └── index.ts
│
├── infrastructure/            # ★新規：インフラ層
│   └── d1/
│       ├── item-repository-impl.ts
│       └── item-read-repository-impl.ts
│
├── shared/                    # ★新規：共有モジュール
│   ├── result.ts              # Neverthrow再エクスポート
│   └── errors.ts              # 共通エラー型
│
├── lib/                       # 既存（段階的に移行）
│   ├── validation.ts          # 入力バリデーション（維持）
│   ├── api-response.ts        # Result型対応に拡張
│   └── constants.ts           # 維持
│
└── types/                     # 段階的に廃止
```

### 3.2 層の責務

| 層 | 責務 | 依存関係 |
|---|------|---------|
| **Domain** | ビジネスルール、エンティティ、値オブジェクト | なし（純粋） |
| **Usecases** | アプリケーションロジック | Domain, Repository Interface |
| **Repositories** | データアクセスインターフェース | Domain |
| **Infrastructure** | 具体的なDB実装 | Repository Interface, D1 |
| **Presentation** | UI、ルーティング、ハンドラ | Usecases |

---

## 4. ドメインモデル設計

### 4.1 Item集約

```typescript
// src/item/domain/write/item.ts
export class Item {
  private constructor(private readonly props: ItemProps) {}

  // ファクトリメソッド（新規作成時）
  static create(params: {
    name: string
    category: string
    color: string
    brand?: string | null
    description?: string | null
  }): Result<Item, ItemError>

  // 再構築メソッド（DB復元時）
  static reconstitute(props: ItemProps): Item

  // ビヘイビアメソッド
  updateName(name: string): Result<void, ItemError>
  updateCategory(category: string): Result<void, ItemError>
  updateColor(color: string): Result<void, ItemError>
  updateBrand(brand: string | null): void
  updateDescription(description: string | null): void

  // ゲッター
  get id(): ItemId
  get name(): ItemName
  get category(): Category
  get color(): Color
  get brand(): string | null
  get description(): string | null
  get createdAt(): Date
  get updatedAt(): Date
}
```

### 4.2 値オブジェクト

| 値オブジェクト | ファイル | バリデーションルール |
|---------------|---------|---------------------|
| ItemId | `item-id.ts` | 正の整数 |
| ItemName | `item-name.ts` | 空文字禁止、最大100文字 |
| Category | `category.ts` | 'outer', 'tops', 'bottoms', 'shoes', 'accessories' のいずれか |
| Color | `color.ts` | 空文字禁止 |

### 4.3 エラー型

```typescript
// src/item/domain/write/errors.ts
export type ItemError =
  | { type: 'INVALID_ITEM_ID'; message: string }
  | { type: 'INVALID_ITEM_NAME'; message: string }
  | { type: 'INVALID_CATEGORY'; message: string }
  | { type: 'INVALID_COLOR'; message: string }
  | { type: 'ITEM_NOT_FOUND'; id: number }
  | { type: 'DATABASE_ERROR'; cause: unknown }
```

---

## 5. CQRS設計

### 5.1 Write Model（コマンド側）
- `Item` エンティティを使用
- バリデーションはドメイン内（値オブジェクト・エンティティ）で実行
- 作成・更新・削除操作

### 5.2 Read Model（クエリ側）

```typescript
// 詳細表示用DTO
interface ItemReadModel {
  id: number
  name: string
  category: 'outer' | 'tops' | 'bottoms' | 'shoes' | 'accessories'
  color: string
  brand: string | null
  description: string | null
  createdAt: string  // ISO形式
  updatedAt: string
}

// 一覧表示用軽量DTO
interface ItemListReadModel {
  id: number
  name: string
  category: string
  color: string
  brand: string | null
}
```

### 5.3 分離の理由
- **Read**: ドメインロジック不要、直接DTOを返す（効率的）
- **Write**: バリデーション、ビジネスルール適用が必要

---

## 6. ユースケース設計

| ユースケース | 種別 | 入力 | 出力 |
|-------------|------|------|------|
| CreateItem | Write | CreateItemInput | Result<ItemReadModel, ItemError> |
| UpdateItem | Write | id + UpdateItemInput | Result<ItemReadModel, ItemError> |
| DeleteItem | Write | id | Result<void, ItemError> |
| GetItem | Read | id | Result<ItemReadModel, ItemError> |
| ListItems | Read | なし | Result<ItemListReadModel[], ItemError> |
| ListItemsByCategory | Read | category | Result<ItemListReadModel[], ItemError> |

---

## 7. リポジトリ設計

### 7.1 Write Repository インターフェース

```typescript
interface ItemRepository {
  save(item: Item): ResultAsync<Item, ItemError>
  findById(id: ItemId): ResultAsync<Item | null, ItemError>
  delete(id: ItemId): ResultAsync<boolean, ItemError>
}
```

### 7.2 Read Repository インターフェース

```typescript
interface ItemReadRepository {
  findById(id: number): ResultAsync<ItemReadModel | null, ItemError>
  findAll(): ResultAsync<ItemListReadModel[], ItemError>
  findByCategory(category: string): ResultAsync<ItemListReadModel[], ItemError>
}
```

---

## 8. 非機能要件

### パフォーマンス
- 既存のパフォーマンスを維持
- Read操作はDTOを直接返すことで最適化

### テスタビリティ
- リポジトリの抽象化によりユースケースのユニットテストが可能
- 値オブジェクト・エンティティは純粋関数としてテスト可能

### 保守性
- 層の分離により変更の影響範囲を限定
- エラー型の明示により障害対応が容易

---

## 9. エラーハンドリング方針

### Neverthrow使用ルール
1. ドメイン層の関数は `Result<T, ItemError>` を返す
2. リポジトリ層は `ResultAsync<T, ItemError>` を返す
3. ユースケース層は `ResultAsync<T, ItemError>` を返す
4. プレゼンテーション層でHTTPレスポンスに変換

### エラー変換
```typescript
// Result → HTTPレスポンス
result.match(
  (data) => c.json({ success: true, data }),
  (error) => {
    switch (error.type) {
      case 'ITEM_NOT_FOUND':
        return c.json({ success: false, error: { message: error.id } }, 404)
      case 'DATABASE_ERROR':
        return c.json({ success: false, error: { message: 'Internal error' } }, 500)
      default:
        return c.json({ success: false, error: { message: error.message } }, 400)
    }
  }
)
```

---

## 10. 受け入れ条件（Acceptance Criteria）

### 機能要件
- [ ] 全APIエンドポイントが従来通り動作する
- [ ] 全SSRページが従来通り動作する
- [ ] レスポンス形式に変更がない

### 非機能要件
- [ ] 全ての値オブジェクトに単体テストがある
- [ ] 全てのユースケースに単体テストがある
- [ ] リポジトリに統合テストがある
- [ ] 既存のE2Eテストが通過する
- [ ] `npm run build` が成功する
- [ ] `npm run preview` で動作確認できる

### コード品質
- [ ] TypeScriptの型エラーがない
- [ ] ESLintエラーがない
- [ ] 旧コード（app/db/items.ts）が削除されている

---

## 11. 依存関係

### 追加パッケージ
```json
{
  "dependencies": {
    "neverthrow": "^8.0.0"
  }
}
```

### 削除ファイル
- `app/db/items.ts`
- `app/types/item.ts`（または非推奨化）

---

## 12. 参考資料

- [vakkarma-main](https://github.com/calloc134/vakkarma-main) - アーキテクチャの参考
- [Neverthrow](https://github.com/supermacro/neverthrow) - Result型ライブラリ
