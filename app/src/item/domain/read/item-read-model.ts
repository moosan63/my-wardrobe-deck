/**
 * Item Read Model（Query側DTO）
 * データベースから読み取った情報をそのまま表現
 */

import type { CategoryValue } from '../write/category'

/**
 * 詳細表示用DTO
 * 1件の詳細情報を表示する際に使用
 */
export interface ItemReadModel {
  id: number
  name: string
  category: CategoryValue
  color: string
  brand: string | null
  description: string | null
  createdAt: string // ISO 8601形式
  updatedAt: string // ISO 8601形式
}

/**
 * 一覧表示用軽量DTO
 * リスト表示に必要な最小限の情報
 */
export interface ItemListReadModel {
  id: number
  name: string
  category: CategoryValue
  color: string
  brand: string | null
}
