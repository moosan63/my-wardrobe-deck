/**
 * D1ItemReadRepository - D1 Read リポジトリ実装
 * Cloudflare D1（SQLite互換）を使用したRead操作の実装
 */
import { ResultAsync, fromPromise } from '../../shared/result'
import { createDatabaseError, type DatabaseError } from '../../shared/errors'
import type { ItemReadRepository } from '../../src/item/repositories/item-read-repository'
import type { ItemReadModel, ItemListReadModel, CategoryValue } from '../../src/item/domain'

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
 * D1 Read Repository 実装
 * DTOを直接返すことで効率的な読み取りを実現
 */
export class D1ItemReadRepository implements ItemReadRepository {
  constructor(private readonly db: D1Database) {}

  /**
   * IDでアイテム詳細を取得
   */
  findById(id: number): ResultAsync<ItemReadModel | null, DatabaseError> {
    return fromPromise(
      this.db
        .prepare('SELECT * FROM items WHERE id = ?')
        .bind(id)
        .first<ItemRow>(),
      (error) => createDatabaseError(error)
    ).map((row) => {
      if (!row) {
        return null
      }
      return this.toReadModel(row)
    })
  }

  /**
   * 全アイテムを一覧取得（作成日時降順）
   */
  findAll(): ResultAsync<ItemListReadModel[], DatabaseError> {
    return fromPromise(
      this.db
        .prepare('SELECT id, name, category, color, brand FROM items ORDER BY created_at DESC')
        .all<Omit<ItemRow, 'description' | 'created_at' | 'updated_at'>>(),
      (error) => createDatabaseError(error)
    ).map((result) => {
      return result.results.map((row) => this.toListReadModel(row))
    })
  }

  /**
   * カテゴリでアイテムを検索（作成日時降順）
   */
  findByCategory(category: CategoryValue): ResultAsync<ItemListReadModel[], DatabaseError> {
    return fromPromise(
      this.db
        .prepare(
          'SELECT id, name, category, color, brand FROM items WHERE category = ? ORDER BY created_at DESC'
        )
        .bind(category)
        .all<Omit<ItemRow, 'description' | 'created_at' | 'updated_at'>>(),
      (error) => createDatabaseError(error)
    ).map((result) => {
      return result.results.map((row) => this.toListReadModel(row))
    })
  }

  /**
   * DBの行データを詳細用Read Modelに変換
   */
  private toReadModel(row: ItemRow): ItemReadModel {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      color: row.color,
      brand: row.brand,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  /**
   * DBの行データを一覧用Read Modelに変換
   */
  private toListReadModel(
    row: Omit<ItemRow, 'description' | 'created_at' | 'updated_at'>
  ): ItemListReadModel {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      color: row.color,
      brand: row.brand,
    }
  }
}
