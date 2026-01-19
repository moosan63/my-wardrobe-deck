/**
 * ItemId 値オブジェクト
 * アイテムの一意識別子を表す
 */
import { Result, ok, err } from '../../../../shared/result'
import { InvalidItemIdError, createInvalidItemIdError } from './errors'

export class ItemId {
  private constructor(private readonly _value: number) {}

  /**
   * 値を取得
   */
  get value(): number {
    return this._value
  }

  /**
   * ファクトリメソッド（新規作成時・バリデーション付き）
   */
  static create(value: number): Result<ItemId, InvalidItemIdError> {
    if (!Number.isInteger(value)) {
      return err(createInvalidItemIdError('ItemId must be an integer'))
    }

    if (value <= 0) {
      return err(createInvalidItemIdError('ItemId must be a positive integer'))
    }

    return ok(new ItemId(value))
  }

  /**
   * 再構築メソッド（DB復元時・バリデーションなし）
   * DBから読み込んだ値は既にバリデーション済みとみなす
   */
  static reconstitute(value: number): ItemId {
    return new ItemId(value)
  }

  /**
   * 等価性比較
   */
  equals(other: ItemId): boolean {
    return this._value === other._value
  }
}
