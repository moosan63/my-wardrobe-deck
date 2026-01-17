import type { Item, CreateItemInput, UpdateItemInput, Category } from '../types/item'

/**
 * 全アイテムを取得
 */
export async function getAllItems(db: D1Database): Promise<Item[]> {
  const result = await db
    .prepare('SELECT * FROM items ORDER BY created_at DESC')
    .all<Item>()
  return result.results
}

/**
 * IDでアイテムを取得
 */
export async function getItemById(db: D1Database, id: number): Promise<Item | null> {
  const result = await db
    .prepare('SELECT * FROM items WHERE id = ?')
    .bind(id)
    .first<Item>()
  return result ?? null
}

/**
 * カテゴリでアイテムを取得
 */
export async function getItemsByCategory(
  db: D1Database,
  category: Category
): Promise<Item[]> {
  const result = await db
    .prepare('SELECT * FROM items WHERE category = ? ORDER BY created_at DESC')
    .bind(category)
    .all<Item>()
  return result.results
}

/**
 * アイテムを作成
 */
export async function createItem(
  db: D1Database,
  input: CreateItemInput
): Promise<Item> {
  const { name, category, color, brand = null, description = null } = input

  const result = await db
    .prepare(
      `INSERT INTO items (name, category, color, brand, description)
       VALUES (?, ?, ?, ?, ?)
       RETURNING *`
    )
    .bind(name, category, color, brand, description)
    .first<Item>()

  if (!result) {
    throw new Error('Failed to create item')
  }

  return result
}

/**
 * アイテムを更新
 */
export async function updateItem(
  db: D1Database,
  id: number,
  input: UpdateItemInput
): Promise<Item | null> {
  // 現在のアイテムを取得
  const existing = await getItemById(db, id)
  if (!existing) {
    return null
  }

  // 更新フィールドをマージ
  const updated = {
    name: input.name ?? existing.name,
    category: input.category ?? existing.category,
    color: input.color ?? existing.color,
    brand: input.brand !== undefined ? input.brand : existing.brand,
    description: input.description !== undefined ? input.description : existing.description,
  }

  const result = await db
    .prepare(
      `UPDATE items
       SET name = ?, category = ?, color = ?, brand = ?, description = ?, updated_at = datetime('now')
       WHERE id = ?
       RETURNING *`
    )
    .bind(updated.name, updated.category, updated.color, updated.brand, updated.description, id)
    .first<Item>()

  return result ?? null
}

/**
 * アイテムを削除
 */
export async function deleteItem(db: D1Database, id: number): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM items WHERE id = ?')
    .bind(id)
    .run()

  return result.meta.changes > 0
}
