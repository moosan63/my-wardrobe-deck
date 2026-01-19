/**
 * ItemName 値オブジェクト
 * アイテムの名前を表す
 */
import { Result, ok, err } from '../../../../shared/result'
import { InvalidItemNameError, createInvalidItemNameError } from './errors'

const MAX_LENGTH = 100

export class ItemName {
  private constructor(private readonly _value: string) {}

  /**
   * 値を取得
   */
  get value(): string {
    return this._value
  }

  /**
   * ファクトリメソッド（新規作成時・バリデーション付き）
   */
  static create(value: string): Result<ItemName, InvalidItemNameError> {
    const trimmed = value.trim()

    if (trimmed.length === 0) {
      return err(createInvalidItemNameError('ItemName cannot be empty'))
    }

    if (trimmed.length > MAX_LENGTH) {
      return err(createInvalidItemNameError(`ItemName must be at most ${MAX_LENGTH} characters`))
    }

    return ok(new ItemName(trimmed))
  }

  /**
   * 再構築メソッド（DB復元時・バリデーションなし）
   */
  static reconstitute(value: string): ItemName {
    return new ItemName(value)
  }

  /**
   * 等価性比較
   */
  equals(other: ItemName): boolean {
    return this._value === other._value
  }
}
