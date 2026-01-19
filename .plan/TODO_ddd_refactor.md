# TODO: DDD/CQRS アーキテクチャ リファクタリング

## Phase 0: 準備

### 目的
リファクタリングに必要な環境とディレクトリ構造を整備する。

### 作業内容
- [x] neverthrowパッケージをインストール
- [x] 新規ディレクトリ構造を作成
  - `app/src/item/domain/read/`
  - `app/src/item/domain/write/`
  - `app/src/item/repositories/`
  - `app/src/item/usecases/`
  - `app/infrastructure/d1/`
  - `app/shared/`
- [x] `app/shared/result.ts` を作成（Neverthrow再エクスポート）
- [x] `app/shared/errors.ts` を作成（共通エラー型）

### 変更対象
- `package.json`
- 新規ディレクトリ

### 完了条件
- [x] `npm install` が成功する
- [x] ディレクトリ構造が存在する
- [x] 共有モジュールがインポート可能

### ユーザー確認項目
- [x] ディレクトリ構造の確認

---

## Phase 1: ドメイン層構築

### 目的
Item集約のドメインモデル（エンティティ、値オブジェクト）を実装する。

### 作業内容
- [x] `app/src/item/domain/write/errors.ts` - ドメインエラー型
- [x] `app/src/item/domain/write/item-id.ts` - ItemId値オブジェクト
- [x] `app/src/item/domain/write/item-name.ts` - ItemName値オブジェクト
- [x] `app/src/item/domain/write/category.ts` - Category値オブジェクト
- [x] `app/src/item/domain/write/color.ts` - Color値オブジェクト
- [x] `app/src/item/domain/write/item.ts` - Itemエンティティ
- [x] `app/src/item/domain/read/item-read-model.ts` - Read Model定義
- [x] `app/src/item/domain/index.ts` - エクスポート
- [x] 値オブジェクト・エンティティの単体テスト

### 変更対象
- `app/src/item/domain/` 配下（新規8ファイル）
- `tests/unit/item/domain/` 配下（新規テストファイル）

### 完了条件
- 全ての値オブジェクトが正常系・異常系でテストされている
- Itemエンティティが create/reconstitute/update メソッドでテストされている
- `npm run test` が通過する

### ユーザー確認項目
- [x] テスト結果の確認
- [x] ドメインモデルの設計レビュー

---

## Phase 2: リポジトリ層構築

### 目的
リポジトリインターフェースとD1実装を作成する。

### 作業内容
- [x] `app/src/item/repositories/item-repository.ts` - Writeリポジトリインターフェース
- [x] `app/src/item/repositories/item-read-repository.ts` - Readリポジトリインターフェース
- [x] `app/infrastructure/d1/item-repository-impl.ts` - D1 Writeリポジトリ実装
- [x] `app/infrastructure/d1/item-read-repository-impl.ts` - D1 Readリポジトリ実装
- [x] リポジトリ統合テスト

### 変更対象
- `app/src/item/repositories/` 配下（新規2ファイル）
- `app/infrastructure/d1/` 配下（新規2ファイル）
- `tests/integration/repositories/` 配下（新規テストファイル）

### 完了条件
- インターフェースが定義されている
- D1実装がインターフェースを満たしている
- 統合テストが通過する（D1モック使用）

### ユーザー確認項目
- [x] テスト結果の確認
- [x] リポジトリ実装のレビュー

---

## Phase 3: ユースケース層構築

### 目的
アプリケーションのユースケースを実装する。

### 作業内容
- [x] `app/src/item/usecases/create-item.ts` - アイテム作成
- [x] `app/src/item/usecases/update-item.ts` - アイテム更新
- [x] `app/src/item/usecases/delete-item.ts` - アイテム削除
- [x] `app/src/item/usecases/get-item.ts` - アイテム取得
- [x] `app/src/item/usecases/list-items.ts` - アイテム一覧
- [x] `app/src/item/usecases/list-items-by-category.ts` - カテゴリ別一覧
- [x] `app/src/item/index.ts` - エクスポート
- [x] ユースケース単体テスト（リポジトリモック使用）

### 変更対象
- `app/src/item/usecases/` 配下（新規6ファイル）
- `app/src/item/index.ts`（新規）
- `tests/unit/item/usecases/` 配下（新規テストファイル）

### 完了条件
- 全てのユースケースが実装されている
- 正常系・異常系のテストが通過する
- `npm run test` が通過する

### ユーザー確認項目
- [x] テスト結果の確認
- [x] ユースケースの設計レビュー

---

## Phase 4: ハンドラ層移行

### 目的
APIハンドラをユースケース呼び出しに移行する。

### 作業内容
- [ ] `app/lib/api-response.ts` をResult型対応に拡張
- [ ] `app/lib/items-handlers.ts` をユースケース呼び出しに変更
- [ ] `app/routes/api/items/index.ts` の修正
- [ ] `app/routes/api/items/[id].ts` の修正
- [ ] APIエンドポイントE2Eテストの更新

### 変更対象
- `app/lib/api-response.ts`（修正）
- `app/lib/items-handlers.ts`（修正）
- `app/routes/api/items/` 配下（修正）
- `tests/e2e/api/` 配下（修正/新規）

### 完了条件
- 全APIエンドポイントが従来通り動作する
- レスポンス形式に変更がない
- E2Eテストが通過する

### ユーザー確認項目
- [ ] API動作確認（curl/Postman等）
- [ ] テスト結果の確認

---

## Phase 5: SSRページ移行

### 目的
SSRページをユースケース呼び出しに移行する。

### 作業内容
- [ ] `app/routes/index.tsx` - ホームページ
- [ ] `app/routes/items/new.tsx` - 新規作成ページ
- [ ] `app/routes/items/[id]/index.tsx` - 詳細ページ
- [ ] `app/routes/items/[id]/edit.tsx` - 編集ページ
- [ ] `app/routes/items/[id]/delete.tsx` - 削除処理

### 変更対象
- `app/routes/index.tsx`（修正）
- `app/routes/items/` 配下（修正）

### 完了条件
- 全ページが従来通り動作する
- フォームのバリデーション・エラー表示が正常
- 画面遷移が正常

### ユーザー確認項目
- [ ] ブラウザでの動作確認（全ページ）
- [ ] フォーム操作の確認

---

## Phase 6: クリーンアップ

### 目的
旧コードの削除とドキュメント更新を行う。

### 作業内容
- [ ] `app/db/items.ts` の削除
- [ ] `app/types/item.ts` の削除（または非推奨マーク）
- [ ] 不要なインポートの削除
- [ ] README.mdの更新（アーキテクチャ説明）
- [ ] 最終ビルド確認

### 変更対象
- `app/db/items.ts`（削除）
- `app/types/item.ts`（削除/修正）
- `README.md`（修正）

### 完了条件
- 旧コードが削除されている
- 不要なインポートがない
- `npm run build` が成功する
- `npm run preview` で動作確認できる
- TypeScriptエラーがない

### ユーザー確認項目
- [ ] 最終動作確認
- [ ] ビルド成功確認
- [ ] ドキュメントレビュー

---

## 進捗サマリー

| Phase | 状態 | 完了日 |
|-------|------|--------|
| Phase 0: 準備 | 完了 | 2026-01-20 |
| Phase 1: ドメイン層 | 完了 | 2026-01-20 |
| Phase 2: リポジトリ層 | 完了 | 2026-01-20 |
| Phase 3: ユースケース層 | 完了 | 2026-01-20 |
| Phase 4: ハンドラ層移行 | 未着手 | - |
| Phase 5: SSRページ移行 | 未着手 | - |
| Phase 6: クリーンアップ | 未着手 | - |
