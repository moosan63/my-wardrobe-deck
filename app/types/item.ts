/**
 * アイテムのカテゴリ
 */
export type Category = 'outer' | 'tops' | 'bottoms' | 'shoes' | 'accessories'

/**
 * DBに保存されているアイテム
 */
export interface Item {
  id: number
  name: string
  category: Category
  color: string
  brand: string | null
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * アイテム作成時の入力
 */
export interface CreateItemInput {
  name: string
  category: Category
  color: string
  brand?: string | null
  description?: string | null
}

/**
 * アイテム更新時の入力
 */
export interface UpdateItemInput {
  name?: string
  category?: Category
  color?: string
  brand?: string | null
  description?: string | null
}
