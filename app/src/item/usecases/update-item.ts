/**
 * UpdateItem ユースケース
 * 既存アイテムを更新する
 */
import { ResultAsync, okAsync, errAsync } from '../../../shared/result'
import type { ItemRepository } from '../repositories/item-repository'
import type { ItemReadRepository } from '../repositories/item-read-repository'
import { ItemId, ItemError, ItemReadModel, createItemNotFoundError } from '../domain'
import type { DatabaseError } from '../../../shared/errors'

/**
 * UpdateItem の入力型
 * idは必須、それ以外はオプション（指定されたフィールドのみ更新）
 */
export interface UpdateItemInput {
  id: number
  name?: string
  category?: string
  color?: string
  brand?: string | null
  description?: string | null
}

/**
 * UpdateItem ユースケースのエラー型
 */
export type UpdateItemError = ItemError | DatabaseError

/**
 * UpdateItem ユースケース
 * Write操作: 既存のアイテムを更新する
 */
export class UpdateItem {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly itemReadRepository: ItemReadRepository
  ) {}

  /**
   * アイテムを更新する
   * @param input 更新するアイテムの情報
   * @returns 更新されたアイテムのReadModel
   */
  execute(input: UpdateItemInput): ResultAsync<ItemReadModel, UpdateItemError> {
    // 1. IDのバリデーション
    const idResult = ItemId.create(input.id)
    if (idResult.isErr()) {
      return errAsync(idResult.error)
    }
    const itemId = idResult.value

    // 2. 既存のアイテムを取得
    return this.itemRepository.findById(itemId).andThen((existingItem) => {
      if (existingItem === null) {
        return errAsync(createItemNotFoundError(input.id) as UpdateItemError)
      }

      // 3. 更新対象フィールドを適用
      if (input.name !== undefined) {
        const updateResult = existingItem.updateName(input.name)
        if (updateResult.isErr()) {
          return errAsync(updateResult.error as UpdateItemError)
        }
      }

      if (input.category !== undefined) {
        const updateResult = existingItem.updateCategory(input.category)
        if (updateResult.isErr()) {
          return errAsync(updateResult.error as UpdateItemError)
        }
      }

      if (input.color !== undefined) {
        const updateResult = existingItem.updateColor(input.color)
        if (updateResult.isErr()) {
          return errAsync(updateResult.error as UpdateItemError)
        }
      }

      // brand と description は常に更新可能（バリデーションなし）
      if (input.brand !== undefined) {
        existingItem.updateBrand(input.brand)
      }

      if (input.description !== undefined) {
        existingItem.updateDescription(input.description)
      }

      // 4. 更新を永続化
      return this.itemRepository.save(existingItem).andThen((savedItem) => {
        // 5. ReadRepositoryから読み取りモデルを取得
        const savedId = savedItem.id.value
        return this.itemReadRepository.findById(savedId).andThen((readModel) => {
          if (readModel === null) {
            return errAsync(createItemNotFoundError(savedId) as UpdateItemError)
          }
          return okAsync(readModel)
        })
      })
    })
  }
}
