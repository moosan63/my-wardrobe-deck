/**
 * Item エンティティ
 * 衣類アイテムを表すルートエンティティ
 */
import { Result, ok, err } from '../../../../shared/result'
import { ItemId } from './item-id'
import { ItemName } from './item-name'
import { Category } from './category'
import { Color } from './color'
import { ItemError, createInvalidItemIdError } from './errors'

/**
 * 新規作成時のパラメータ
 */
export interface CreateItemParams {
  name: string
  category: string
  color: string
  brand?: string | null
  description?: string | null
}

/**
 * 再構築時のパラメータ（永続化データから）
 */
export interface ReconstituteItemParams {
  id: ItemId
  name: ItemName
  category: Category
  color: Color
  brand: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * エンティティ内部状態
 */
interface ItemProps {
  id: ItemId | null
  name: ItemName
  category: Category
  color: Color
  brand: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export class Item {
  private props: ItemProps

  private constructor(props: ItemProps) {
    this.props = props
  }

  /**
   * ファクトリメソッド（新規作成時）
   * IDは永続化時に割り当てられる
   */
  static create(params: CreateItemParams): Result<Item, ItemError> {
    // 値オブジェクトを作成してバリデーション
    const nameResult = ItemName.create(params.name)
    if (nameResult.isErr()) {
      return err(nameResult.error)
    }

    const categoryResult = Category.create(params.category)
    if (categoryResult.isErr()) {
      return err(categoryResult.error)
    }

    const colorResult = Color.create(params.color)
    if (colorResult.isErr()) {
      return err(colorResult.error)
    }

    const now = new Date()

    return ok(
      new Item({
        id: null, // IDは永続化時に割り当て
        name: nameResult.value,
        category: categoryResult.value,
        color: colorResult.value,
        brand: params.brand ?? null,
        description: params.description ?? null,
        createdAt: now,
        updatedAt: now,
      })
    )
  }

  /**
   * 再構築メソッド（DB復元時）
   * バリデーションなしで直接構築
   */
  static reconstitute(params: ReconstituteItemParams): Item {
    return new Item({
      id: params.id,
      name: params.name,
      category: params.category,
      color: params.color,
      brand: params.brand,
      description: params.description,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    })
  }

  // ======== ゲッター ========

  get id(): ItemId {
    if (this.props.id === null) {
      throw new Error('Item does not have an ID yet')
    }
    return this.props.id
  }

  get name(): ItemName {
    return this.props.name
  }

  get category(): Category {
    return this.props.category
  }

  get color(): Color {
    return this.props.color
  }

  get brand(): string | null {
    return this.props.brand
  }

  get description(): string | null {
    return this.props.description
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  // ======== ID管理 ========

  /**
   * IDが割り当て済みかどうか
   */
  hasId(): boolean {
    return this.props.id !== null
  }

  /**
   * IDを割り当てる（永続化時に1回のみ）
   */
  assignId(id: ItemId): Result<void, ItemError> {
    if (this.props.id !== null) {
      return err(createInvalidItemIdError('Item already has an ID assigned'))
    }
    this.props.id = id
    return ok(undefined)
  }

  // ======== ビヘイビアメソッド ========

  /**
   * 名前を更新
   */
  updateName(name: string): Result<void, ItemError> {
    const nameResult = ItemName.create(name)
    if (nameResult.isErr()) {
      return err(nameResult.error)
    }
    this.props.name = nameResult.value
    this.touch()
    return ok(undefined)
  }

  /**
   * カテゴリを更新
   */
  updateCategory(category: string): Result<void, ItemError> {
    const categoryResult = Category.create(category)
    if (categoryResult.isErr()) {
      return err(categoryResult.error)
    }
    this.props.category = categoryResult.value
    this.touch()
    return ok(undefined)
  }

  /**
   * 色を更新
   */
  updateColor(color: string): Result<void, ItemError> {
    const colorResult = Color.create(color)
    if (colorResult.isErr()) {
      return err(colorResult.error)
    }
    this.props.color = colorResult.value
    this.touch()
    return ok(undefined)
  }

  /**
   * ブランドを更新
   */
  updateBrand(brand: string | null): void {
    this.props.brand = brand
    this.touch()
  }

  /**
   * 説明を更新
   */
  updateDescription(description: string | null): void {
    this.props.description = description
    this.touch()
  }

  /**
   * 更新日時を現在に更新
   */
  private touch(): void {
    this.props.updatedAt = new Date()
  }
}
