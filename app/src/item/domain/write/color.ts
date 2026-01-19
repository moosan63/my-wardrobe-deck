/**
 * Color 値オブジェクト
 * アイテムの色を表す
 */
import { Result, ok, err } from '../../../../shared/result'
import { InvalidColorError, createInvalidColorError } from './errors'

export class Color {
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
  static create(value: string): Result<Color, InvalidColorError> {
    const trimmed = value.trim()

    if (trimmed.length === 0) {
      return err(createInvalidColorError('Color cannot be empty'))
    }

    return ok(new Color(trimmed))
  }

  /**
   * 再構築メソッド（DB復元時・バリデーションなし）
   */
  static reconstitute(value: string): Color {
    return new Color(value)
  }

  /**
   * 等価性比較
   */
  equals(other: Color): boolean {
    return this._value === other._value
  }
}
