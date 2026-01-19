/**
 * GetItem ユースケース
 * IDでアイテムを取得する
 */
import { ResultAsync, errAsync, okAsync } from '../../../shared/result'
import type { ItemReadRepository } from '../repositories/item-read-repository'
import { ItemId, ItemError, ItemReadModel, createItemNotFoundError } from '../domain'
import type { DatabaseError } from '../../../shared/errors'

/**
 * GetItem ユースケースのエラー型
 */
export type GetItemError = ItemError | DatabaseError

/**
 * GetItem ユースケース
 * Read操作: ItemReadRepositoryからアイテムの詳細を取得する
 */
export class GetItem {
  constructor(private readonly itemReadRepository: ItemReadRepository) {}

  /**
   * アイテムを取得する
   * @param id 取得するアイテムのID
   * @returns アイテムのReadModel
   */
  execute(id: number): ResultAsync<ItemReadModel, GetItemError> {
    // 1. IDのバリデーション
    const idResult = ItemId.create(id)
    if (idResult.isErr()) {
      return errAsync(idResult.error)
    }

    // 2. ReadRepositoryから取得
    return this.itemReadRepository.findById(id).andThen((readModel) => {
      if (readModel === null) {
        return errAsync(createItemNotFoundError(id) as GetItemError)
      }
      return okAsync(readModel)
    })
  }
}
