/**
 * CreateItem ユースケース
 * 新規アイテムを作成する
 */
import { ResultAsync, okAsync, errAsync } from '../../../shared/result'
import type { ItemRepository } from '../repositories/item-repository'
import type { ItemReadRepository } from '../repositories/item-read-repository'
import { Item, ItemError, ItemReadModel, createItemNotFoundError } from '../domain'
import type { DatabaseError } from '../../../shared/errors'

/**
 * CreateItem の入力型
 */
export interface CreateItemInput {
  name: string
  category: string
  color: string
  brand?: string | null
  description?: string | null
}

/**
 * CreateItem ユースケースのエラー型
 */
export type CreateItemError = ItemError | DatabaseError

/**
 * CreateItem ユースケース
 * Write操作: ItemRepositoryでアイテムを作成し、ItemReadRepositoryで読み取りモデルを返す
 */
export class CreateItem {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly itemReadRepository: ItemReadRepository
  ) {}

  /**
   * アイテムを作成する
   * @param input 作成するアイテムの情報
   * @returns 作成されたアイテムのReadModel
   */
  execute(input: CreateItemInput): ResultAsync<ItemReadModel, CreateItemError> {
    // 1. Itemエンティティを作成（バリデーション実行）
    const itemResult = Item.create({
      name: input.name,
      category: input.category,
      color: input.color,
      brand: input.brand,
      description: input.description,
    })

    if (itemResult.isErr()) {
      return errAsync(itemResult.error)
    }

    const item = itemResult.value

    // 2. リポジトリで永続化
    return this.itemRepository.save(item).andThen((savedItem) => {
      // 3. ReadRepositoryから読み取りモデルを取得
      const itemId = savedItem.id.value
      return this.itemReadRepository.findById(itemId).andThen((readModel) => {
        if (readModel === null) {
          return errAsync(createItemNotFoundError(itemId) as CreateItemError)
        }
        return okAsync(readModel)
      })
    })
  }
}
