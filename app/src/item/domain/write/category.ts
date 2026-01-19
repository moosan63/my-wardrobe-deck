/**
 * Category 値オブジェクト
 * アイテムのカテゴリを表す
 */
import { Result, ok, err } from '../../../../shared/result'
import { InvalidCategoryError, createInvalidCategoryError } from './errors'

/**
 * 有効なカテゴリ値
 */
export const VALID_CATEGORIES = ['outer', 'tops', 'bottoms', 'shoes', 'accessories'] as const

/**
 * カテゴリ値の型
 */
export type CategoryValue = (typeof VALID_CATEGORIES)[number]

export class Category {
  private constructor(private readonly _value: CategoryValue) {}

  /**
   * 値を取得
   */
  get value(): CategoryValue {
    return this._value
  }

  /**
   * ファクトリメソッド（新規作成時・バリデーション付き）
   */
  static create(value: string): Result<Category, InvalidCategoryError> {
    if (!VALID_CATEGORIES.includes(value as CategoryValue)) {
      return err(
        createInvalidCategoryError(
          `Invalid category: "${value}". Must be one of: ${VALID_CATEGORIES.join(', ')}`
        )
      )
    }

    return ok(new Category(value as CategoryValue))
  }

  /**
   * 再構築メソッド（DB復元時・バリデーションなし）
   */
  static reconstitute(value: CategoryValue): Category {
    return new Category(value)
  }

  /**
   * 等価性比較
   */
  equals(other: Category): boolean {
    return this._value === other._value
  }
}
