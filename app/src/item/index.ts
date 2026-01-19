/**
 * Item Bounded Context エクスポート
 * ユースケース層、ドメイン層、リポジトリインターフェースをまとめてエクスポート
 */

// Domain Layer
export {
  // Write Model
  Item,
  ItemId,
  ItemName,
  Category,
  Color,
  VALID_CATEGORIES,
  // Errors
  createInvalidItemIdError,
  createInvalidItemNameError,
  createInvalidCategoryError,
  createInvalidColorError,
  createItemNotFoundError,
} from './domain'

export type {
  // Write Model Types
  CreateItemParams,
  ReconstituteItemParams,
  CategoryValue,
  // Error Types
  ItemError,
  InvalidItemIdError,
  InvalidItemNameError,
  InvalidCategoryError,
  InvalidColorError,
  ItemNotFoundError,
  // Read Model Types
  ItemReadModel,
  ItemListReadModel,
} from './domain'

// Repository Interfaces
export type {
  ItemRepository,
  RepositoryError,
} from './repositories'

export type {
  ItemReadRepository,
} from './repositories'

// Usecases
export {
  // Write Usecases
  CreateItem,
  UpdateItem,
  DeleteItem,
  // Read Usecases
  GetItem,
  ListItems,
  ListItemsByCategory,
} from './usecases'

export type {
  // Write Usecase Types
  CreateItemInput,
  CreateItemError,
  UpdateItemInput,
  UpdateItemError,
  DeleteItemError,
  // Read Usecase Types
  GetItemError,
  ListItemsError,
  ListItemsByCategoryError,
} from './usecases'
