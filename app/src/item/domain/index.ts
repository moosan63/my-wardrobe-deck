/**
 * Item Domain エクスポート
 */

// Write Model (Command側)
export { Item } from './write/item'
export type { CreateItemParams, ReconstituteItemParams } from './write/item'
export { ItemId } from './write/item-id'
export { ItemName } from './write/item-name'
export { Category, VALID_CATEGORIES } from './write/category'
export type { CategoryValue } from './write/category'
export { Color } from './write/color'

// Errors
export {
  type ItemError,
  type InvalidItemIdError,
  type InvalidItemNameError,
  type InvalidCategoryError,
  type InvalidColorError,
  type ItemNotFoundError,
  createInvalidItemIdError,
  createInvalidItemNameError,
  createInvalidCategoryError,
  createInvalidColorError,
  createItemNotFoundError,
} from './write/errors'

// Read Model (Query側)
export type { ItemReadModel, ItemListReadModel } from './read/item-read-model'
