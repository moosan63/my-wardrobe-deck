import type { CategoryValue } from '../src/item/domain'

/**
 * 利用可能なカテゴリ一覧
 */
export const CATEGORIES: readonly CategoryValue[] = [
  'outer',
  'tops',
  'bottoms',
  'shoes',
  'accessories',
] as const

/**
 * カテゴリの日本語表示名マッピング
 */
export const CATEGORY_LABELS: Record<CategoryValue, string> = {
  outer: 'アウター',
  tops: 'トップス',
  bottoms: 'ボトムス',
  shoes: 'シューズ',
  accessories: 'アクセサリー',
} as const

/**
 * カテゴリのFont Awesomeアイコンクラス
 */
export const CATEGORY_ICONS: Record<CategoryValue, string> = {
  outer: 'fa-vest',
  tops: 'fa-shirt',
  bottoms: 'fa-person',
  shoes: 'fa-shoe-prints',
  accessories: 'fa-gem',
} as const

/**
 * カテゴリが有効かどうかを判定
 */
export function isValidCategory(value: string): value is CategoryValue {
  return CATEGORIES.includes(value as CategoryValue)
}
