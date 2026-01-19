/**
 * ItemRepository - Write側リポジトリインターフェース
 * Command操作（作成・更新・削除）を担当
 */
import type { ResultAsync } from '../../../shared/result'
import type { Item, ItemId, ItemError } from '../domain'
import type { DatabaseError } from '../../../shared/errors'

/**
 * Write リポジトリのエラー型
 */
export type RepositoryError = ItemError | DatabaseError

/**
 * Item Write Repository インターフェース
 * CQRS の Command 側を担当
 */
export interface ItemRepository {
  /**
   * アイテムを永続化する
   * - 新規の場合（IDなし）: INSERT して ID を割り当てた Item を返す
   * - 既存の場合（IDあり）: UPDATE して更新後の Item を返す
   */
  save(item: Item): ResultAsync<Item, RepositoryError>

  /**
   * IDでアイテムを取得
   * - 存在する場合: Item エンティティを返す
   * - 存在しない場合: null を返す
   */
  findById(id: ItemId): ResultAsync<Item | null, RepositoryError>

  /**
   * アイテムを削除
   * - 削除成功: true
   * - 対象なし: false
   */
  delete(id: ItemId): ResultAsync<boolean, RepositoryError>
}
