import type { Category } from '../types/item'

/**
 * 利用可能なカテゴリ一覧
 */
export const CATEGORIES: readonly Category[] = [
  'outer',
  'tops',
  'bottoms',
  'shoes',
  'accessories',
] as const

/**
 * カテゴリの日本語表示名マッピング
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  outer: 'アウター',
  tops: 'トップス',
  bottoms: 'ボトムス',
  shoes: 'シューズ',
  accessories: 'アクセサリー',
} as const

/**
 * カテゴリのFont Awesomeアイコンクラス
 */
export const CATEGORY_ICONS: Record<Category, string> = {
  outer: 'fa-vest',
  tops: 'fa-shirt',
  bottoms: 'fa-person',
  shoes: 'fa-shoe-prints',
  accessories: 'fa-gem',
} as const

/**
 * カテゴリが有効かどうかを判定
 */
export function isValidCategory(value: string): value is Category {
  return CATEGORIES.includes(value as Category)
}
