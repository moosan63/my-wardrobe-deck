/**
 * ItemReadRepository - Read側リポジトリインターフェース
 * Query操作（取得・一覧・検索）を担当
 */
import type { ResultAsync } from '../../../shared/result'
import type { ItemReadModel, ItemListReadModel, CategoryValue } from '../domain'
import type { DatabaseError } from '../../../shared/errors'

/**
 * Item Read Repository インターフェース
 * CQRS の Query 側を担当
 * DTOを直接返すことで効率的な読み取りを実現
 */
export interface ItemReadRepository {
  /**
   * IDでアイテム詳細を取得
   * - 存在する場合: ItemReadModel を返す
   * - 存在しない場合: null を返す
   */
  findById(id: number): ResultAsync<ItemReadModel | null, DatabaseError>

  /**
   * 全アイテムを一覧取得
   * 作成日時の降順でソート
   */
  findAll(): ResultAsync<ItemListReadModel[], DatabaseError>

  /**
   * カテゴリでアイテムを検索
   * 作成日時の降順でソート
   */
  findByCategory(category: CategoryValue): ResultAsync<ItemListReadModel[], DatabaseError>
}
