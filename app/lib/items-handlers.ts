import type { Context } from 'hono'
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  errorToResponse,
} from './api-response'
import {
  CreateItem,
  UpdateItem,
  DeleteItem,
  GetItem,
  ListItems,
  ListItemsByCategory,
  VALID_CATEGORIES,
  type CategoryValue,
} from '../src/item'
import { D1ItemRepository, D1ItemReadRepository } from '../infrastructure/d1'

type Env = { Bindings: { DB: D1Database } }

/**
 * IDパラメータをパースして数値に変換
 * 無効な場合はnullを返す
 */
function parseId(idParam: string | undefined): number | null {
  if (!idParam) {
    return null
  }
  const id = parseInt(idParam, 10)
  if (isNaN(id) || id <= 0) {
    return null
  }
  return id
}

/**
 * カテゴリパラメータを検証する
 * 有効な場合はCategoryValue、無効な場合はnullを返す
 */
function validateCategory(categoryParam: string): CategoryValue | null {
  if (VALID_CATEGORIES.includes(categoryParam as CategoryValue)) {
    return categoryParam as CategoryValue
  }
  return null
}

/**
 * GET /api/items
 * 全アイテムを取得（categoryクエリパラメータでフィルタリング可能）
 */
export async function getItemsHandler(c: Context<Env>) {
  const db = c.env.DB
  const categoryParam = c.req.query('category')

  // リポジトリをインスタンス化
  const itemReadRepository = new D1ItemReadRepository(db)

  // categoryパラメータがある場合はバリデーション
  if (categoryParam) {
    const category = validateCategory(categoryParam)
    if (category === null) {
      return badRequestResponse(c, `Invalid category: must be one of ${VALID_CATEGORIES.join(', ')}`)
    }

    const listItemsByCategory = new ListItemsByCategory(itemReadRepository)
    const result = await listItemsByCategory.execute(category)

    return result.match(
      (items) => successResponse(c, items),
      (error) => errorToResponse(c, error)
    )
  }

  // categoryがない場合は全件取得
  const listItems = new ListItems(itemReadRepository)
  const result = await listItems.execute()

  return result.match(
    (items) => successResponse(c, items),
    (error) => errorToResponse(c, error)
  )
}

/**
 * POST /api/items
 * 新しいアイテムを作成
 */
export async function postItemsHandler(c: Context<Env>) {
  const db = c.env.DB

  // JSONパース
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return badRequestResponse(c, 'Invalid JSON in request body')
  }

  // リクエストボディの型チェック
  if (typeof body !== 'object' || body === null) {
    return badRequestResponse(c, 'Request body must be an object')
  }

  const requestBody = body as Record<string, unknown>

  // 必須フィールドのチェック
  if (typeof requestBody.name !== 'string') {
    return badRequestResponse(c, 'name: Required')
  }
  if (typeof requestBody.category !== 'string') {
    return badRequestResponse(c, 'category: Required')
  }
  if (typeof requestBody.color !== 'string') {
    return badRequestResponse(c, 'color: Required')
  }

  // リポジトリをインスタンス化
  const itemRepository = new D1ItemRepository(db)
  const itemReadRepository = new D1ItemReadRepository(db)

  // ユースケースを実行
  const createItem = new CreateItem(itemRepository, itemReadRepository)
  const result = await createItem.execute({
    name: requestBody.name,
    category: requestBody.category,
    color: requestBody.color,
    brand: typeof requestBody.brand === 'string' ? requestBody.brand : null,
    description: typeof requestBody.description === 'string' ? requestBody.description : null,
  })

  return result.match(
    (item) => createdResponse(c, item),
    (error) => errorToResponse(c, error)
  )
}

/**
 * GET /api/items/:id
 * IDでアイテムを取得
 */
export async function getItemHandler(c: Context<Env>) {
  const db = c.env.DB
  const idParam = c.req.param('id')
  const id = parseId(idParam)

  if (id === null) {
    return badRequestResponse(c, 'Invalid id: must be a positive integer')
  }

  // リポジトリをインスタンス化
  const itemReadRepository = new D1ItemReadRepository(db)

  // ユースケースを実行
  const getItem = new GetItem(itemReadRepository)
  const result = await getItem.execute(id)

  return result.match(
    (item) => successResponse(c, item),
    (error) => errorToResponse(c, error)
  )
}

/**
 * PUT /api/items/:id
 * アイテムを更新
 */
export async function putItemHandler(c: Context<Env>) {
  const db = c.env.DB
  const idParam = c.req.param('id')
  const id = parseId(idParam)

  if (id === null) {
    return badRequestResponse(c, 'Invalid id: must be a positive integer')
  }

  // JSONパース
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return badRequestResponse(c, 'Invalid JSON in request body')
  }

  // リクエストボディの型チェック
  if (typeof body !== 'object' || body === null) {
    return badRequestResponse(c, 'Request body must be an object')
  }

  const requestBody = body as Record<string, unknown>

  // リポジトリをインスタンス化
  const itemRepository = new D1ItemRepository(db)
  const itemReadRepository = new D1ItemReadRepository(db)

  // ユースケースを実行
  const updateItem = new UpdateItem(itemRepository, itemReadRepository)
  const result = await updateItem.execute({
    id,
    name: typeof requestBody.name === 'string' ? requestBody.name : undefined,
    category: typeof requestBody.category === 'string' ? requestBody.category : undefined,
    color: typeof requestBody.color === 'string' ? requestBody.color : undefined,
    brand: requestBody.brand === null ? null : (typeof requestBody.brand === 'string' ? requestBody.brand : undefined),
    description: requestBody.description === null ? null : (typeof requestBody.description === 'string' ? requestBody.description : undefined),
  })

  return result.match(
    (item) => successResponse(c, item),
    (error) => errorToResponse(c, error)
  )
}

/**
 * DELETE /api/items/:id
 * アイテムを削除
 */
export async function deleteItemHandler(c: Context<Env>) {
  const db = c.env.DB
  const idParam = c.req.param('id')
  const id = parseId(idParam)

  if (id === null) {
    return badRequestResponse(c, 'Invalid id: must be a positive integer')
  }

  // リポジトリをインスタンス化
  const itemRepository = new D1ItemRepository(db)

  // ユースケースを実行
  const deleteItem = new DeleteItem(itemRepository)
  const result = await deleteItem.execute(id)

  return result.match(
    () => successResponse(c, { message: 'Item deleted successfully' }),
    (error) => errorToResponse(c, error)
  )
}
