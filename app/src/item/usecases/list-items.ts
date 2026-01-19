/**
 * ListItems ユースケース
 * 全アイテムを一覧取得する
 */
import { ResultAsync } from '../../../shared/result'
import type { ItemReadRepository } from '../repositories/item-read-repository'
import type { ItemListReadModel } from '../domain'
import type { DatabaseError } from '../../../shared/errors'

/**
 * ListItems ユースケースのエラー型
 */
export type ListItemsError = DatabaseError

/**
 * ListItems ユースケース
 * Read操作: 全アイテムの一覧を取得する
 */
export class ListItems {
  constructor(private readonly itemReadRepository: ItemReadRepository) {}

  /**
   * 全アイテムを取得する
   * @returns アイテム一覧のReadModel配列
   */
  execute(): ResultAsync<ItemListReadModel[], ListItemsError> {
    return this.itemReadRepository.findAll()
  }
}
