/**
 * ListItemsByCategory ユースケース
 * カテゴリでアイテムを絞り込んで一覧取得する
 */
import { ResultAsync, errAsync } from '../../../shared/result'
import type { ItemReadRepository } from '../repositories/item-read-repository'
import { Category, ItemError, ItemListReadModel } from '../domain'
import type { CategoryValue } from '../domain'
import type { DatabaseError } from '../../../shared/errors'

/**
 * ListItemsByCategory ユースケースのエラー型
 */
export type ListItemsByCategoryError = ItemError | DatabaseError

/**
 * ListItemsByCategory ユースケース
 * Read操作: 指定されたカテゴリのアイテム一覧を取得する
 */
export class ListItemsByCategory {
  constructor(private readonly itemReadRepository: ItemReadRepository) {}

  /**
   * カテゴリでアイテムを絞り込む
   * @param category カテゴリ値
   * @returns 該当カテゴリのアイテム一覧
   */
  execute(category: CategoryValue): ResultAsync<ItemListReadModel[], ListItemsByCategoryError> {
    // 1. カテゴリのバリデーション
    const categoryResult = Category.create(category)
    if (categoryResult.isErr()) {
      return errAsync(categoryResult.error)
    }

    // 2. ReadRepositoryから取得
    return this.itemReadRepository.findByCategory(category)
  }
}
