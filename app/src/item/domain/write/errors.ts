/**
 * Item集約のドメインエラー型定義
 */

/**
 * 無効なItemId
 */
export interface InvalidItemIdError {
  type: 'INVALID_ITEM_ID'
  message: string
}

/**
 * 無効なItemName
 */
export interface InvalidItemNameError {
  type: 'INVALID_ITEM_NAME'
  message: string
}

/**
 * 無効なCategory
 */
export interface InvalidCategoryError {
  type: 'INVALID_CATEGORY'
  message: string
}

/**
 * 無効なColor
 */
export interface InvalidColorError {
  type: 'INVALID_COLOR'
  message: string
}

/**
 * アイテムが見つからない
 */
export interface ItemNotFoundError {
  type: 'ITEM_NOT_FOUND'
  id: number
}

/**
 * Item集約のエラー型（union）
 */
export type ItemError =
  | InvalidItemIdError
  | InvalidItemNameError
  | InvalidCategoryError
  | InvalidColorError
  | ItemNotFoundError

/**
 * InvalidItemIdError を作成するヘルパー
 */
export function createInvalidItemIdError(message: string): InvalidItemIdError {
  return {
    type: 'INVALID_ITEM_ID',
    message,
  }
}

/**
 * InvalidItemNameError を作成するヘルパー
 */
export function createInvalidItemNameError(message: string): InvalidItemNameError {
  return {
    type: 'INVALID_ITEM_NAME',
    message,
  }
}

/**
 * InvalidCategoryError を作成するヘルパー
 */
export function createInvalidCategoryError(message: string): InvalidCategoryError {
  return {
    type: 'INVALID_CATEGORY',
    message,
  }
}

/**
 * InvalidColorError を作成するヘルパー
 */
export function createInvalidColorError(message: string): InvalidColorError {
  return {
    type: 'INVALID_COLOR',
    message,
  }
}

/**
 * ItemNotFoundError を作成するヘルパー
 */
export function createItemNotFoundError(id: number): ItemNotFoundError {
  return {
    type: 'ITEM_NOT_FOUND',
    id,
  }
}
