/**
 * D1ItemRepository - D1 Write リポジトリ実装
 * Cloudflare D1（SQLite互換）を使用したWrite操作の実装
 */
import { ResultAsync, fromPromise, errAsync, okAsync } from '../../shared/result'
import { createDatabaseError, type DatabaseError } from '../../shared/errors'
import type { ItemRepository, RepositoryError } from '../../src/item/repositories/item-repository'
import {
  Item,
  ItemId,
  ItemName,
  Category,
  Color,
  type ItemError,
  type CategoryValue,
} from '../../src/item/domain'

/**
 * D1から取得した生データの型
 */
interface ItemRow {
  id: number
  name: string
  category: CategoryValue
  color: string
  brand: string | null
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * D1 Write Repository 実装
 */
export class D1ItemRepository implements ItemRepository {
  constructor(private readonly db: D1Database) {}

  /**
   * アイテムを永続化する
   */
  save(item: Item): ResultAsync<Item, RepositoryError> {
    if (item.hasId()) {
      return this.update(item)
    } else {
      return this.insert(item)
    }
  }

  /**
   * IDでアイテムを取得
   */
  findById(id: ItemId): ResultAsync<Item | null, RepositoryError> {
    return fromPromise(
      this.db
        .prepare('SELECT * FROM items WHERE id = ?')
        .bind(id.value)
        .first<ItemRow>(),
      (error) => createDatabaseError(error) as RepositoryError
    ).map((row) => {
      if (!row) {
        return null
      }
      return this.toEntity(row)
    })
  }

  /**
   * アイテムを削除
   */
  delete(id: ItemId): ResultAsync<boolean, RepositoryError> {
    return fromPromise(
      this.db.prepare('DELETE FROM items WHERE id = ?').bind(id.value).run(),
      (error) => createDatabaseError(error) as RepositoryError
    ).map((result) => result.meta.changes > 0)
  }

  /**
   * INSERT操作（新規作成）
   */
  private insert(item: Item): ResultAsync<Item, RepositoryError> {
    return fromPromise(
      this.db
        .prepare(
          `INSERT INTO items (name, category, color, brand, description)
           VALUES (?, ?, ?, ?, ?)
           RETURNING *`
        )
        .bind(
          item.name.value,
          item.category.value,
          item.color.value,
          item.brand,
          item.description
        )
        .first<ItemRow>(),
      (error) => createDatabaseError(error) as RepositoryError
    ).andThen((row) => {
      if (!row) {
        return errAsync(createDatabaseError(new Error('Insert succeeded but RETURNING clause returned no data')) as RepositoryError)
      }
      const entity = this.toEntity(row)
      // 元のItemオブジェクトにIDを割り当て
      const idResult = ItemId.create(row.id)
      if (idResult.isErr()) {
        return errAsync(idResult.error as RepositoryError)
      }
      item.assignId(idResult.value)
      return okAsync(entity)
    })
  }

  /**
   * UPDATE操作（更新）
   */
  private update(item: Item): ResultAsync<Item, RepositoryError> {
    return fromPromise(
      this.db
        .prepare(
          `UPDATE items
           SET name = ?, category = ?, color = ?, brand = ?, description = ?, updated_at = datetime('now')
           WHERE id = ?
           RETURNING *`
        )
        .bind(
          item.name.value,
          item.category.value,
          item.color.value,
          item.brand,
          item.description,
          item.id.value
        )
        .first<ItemRow>(),
      (error) => createDatabaseError(error) as RepositoryError
    ).map((row) => {
      if (!row) {
        // 更新対象が見つからない場合は元のアイテムを返す
        return item
      }
      return this.toEntity(row)
    })
  }

  /**
   * DBの行データをエンティティに変換
   */
  private toEntity(row: ItemRow): Item {
    return Item.reconstitute({
      id: ItemId.reconstitute(row.id),
      name: ItemName.reconstitute(row.name),
      category: Category.reconstitute(row.category),
      color: Color.reconstitute(row.color),
      brand: row.brand,
      description: row.description,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    })
  }
}
