/**
 * DeleteItem ユースケース
 * 既存アイテムを削除する
 */
import { ResultAsync, errAsync, okAsync } from '../../../shared/result'
import type { ItemRepository } from '../repositories/item-repository'
import { ItemId, ItemError, createItemNotFoundError } from '../domain'
import type { DatabaseError } from '../../../shared/errors'

/**
 * DeleteItem ユースケースのエラー型
 */
export type DeleteItemError = ItemError | DatabaseError

/**
 * DeleteItem ユースケース
 * Write操作: 指定されたIDのアイテムを削除する
 */
export class DeleteItem {
  constructor(private readonly itemRepository: ItemRepository) {}

  /**
   * アイテムを削除する
   * @param id 削除するアイテムのID
   * @returns 成功時はvoid、失敗時はエラー
   */
  execute(id: number): ResultAsync<void, DeleteItemError> {
    // 1. IDのバリデーション
    const idResult = ItemId.create(id)
    if (idResult.isErr()) {
      return errAsync(idResult.error)
    }
    const itemId = idResult.value

    // 2. リポジトリで削除
    return this.itemRepository.delete(itemId).andThen((deleted) => {
      if (!deleted) {
        return errAsync(createItemNotFoundError(id) as DeleteItemError)
      }
      return okAsync(undefined)
    })
  }
}
