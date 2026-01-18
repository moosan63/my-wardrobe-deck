import type { Context } from 'hono'
import { getAllItems, getItemsByCategory, createItem, getItemById, updateItem, deleteItem } from '../db/items'
import { createItemSchema, updateItemSchema, categorySchema } from './validation'
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
} from './api-response'
import type { Category } from '../types/item'

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
 * GET /api/items
 * 全アイテムを取得（categoryクエリパラメータでフィルタリング可能）
 */
export async function getItemsHandler(c: Context<Env>) {
  try {
    const db = c.env.DB
    const categoryParam = c.req.query('category')

    // categoryパラメータがある場合はバリデーション
    if (categoryParam) {
      const categoryResult = categorySchema.safeParse(categoryParam)
      if (!categoryResult.success) {
        return badRequestResponse(c, `Invalid category: ${categoryResult.error.errors[0].message}`)
      }
      const items = await getItemsByCategory(db, categoryResult.data as Category)
      return successResponse(c, items)
    }

    // categoryがない場合は全件取得
    const items = await getAllItems(db)
    return successResponse(c, items)
  } catch (error) {
    console.error('GET /api/items error:', error)
    return serverErrorResponse(c)
  }
}

/**
 * POST /api/items
 * 新しいアイテムを作成
 */
export async function postItemsHandler(c: Context<Env>) {
  try {
    const db = c.env.DB

    // JSONパース
    let body: unknown
    try {
      body = await c.req.json()
    } catch {
      return badRequestResponse(c, 'Invalid JSON in request body')
    }

    // バリデーション
    const result = createItemSchema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.errors[0]
      return badRequestResponse(c, `${firstError.path.join('.')}: ${firstError.message}`)
    }

    // アイテム作成
    const item = await createItem(db, result.data)
    return createdResponse(c, item)
  } catch (error) {
    console.error('POST /api/items error:', error)
    return serverErrorResponse(c)
  }
}

/**
 * GET /api/items/:id
 * IDでアイテムを取得
 */
export async function getItemHandler(c: Context<Env>) {
  try {
    const db = c.env.DB
    const idParam = c.req.param('id')
    const id = parseId(idParam)

    if (id === null) {
      return badRequestResponse(c, 'Invalid id: must be a positive integer')
    }

    const item = await getItemById(db, id)
    if (!item) {
      return notFoundResponse(c, `Item not found: id=${id}`)
    }

    return successResponse(c, item)
  } catch (error) {
    console.error('GET /api/items/:id error:', error)
    return serverErrorResponse(c)
  }
}

/**
 * PUT /api/items/:id
 * アイテムを更新
 */
export async function putItemHandler(c: Context<Env>) {
  try {
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

    // バリデーション
    const result = updateItemSchema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.errors[0]
      return badRequestResponse(c, `${firstError.path.join('.')}: ${firstError.message}`)
    }

    // アイテム更新
    const item = await updateItem(db, id, result.data)
    if (!item) {
      return notFoundResponse(c, `Item not found: id=${id}`)
    }

    return successResponse(c, item)
  } catch (error) {
    console.error('PUT /api/items/:id error:', error)
    return serverErrorResponse(c)
  }
}

/**
 * DELETE /api/items/:id
 * アイテムを削除
 */
export async function deleteItemHandler(c: Context<Env>) {
  try {
    const db = c.env.DB
    const idParam = c.req.param('id')
    const id = parseId(idParam)

    if (id === null) {
      return badRequestResponse(c, 'Invalid id: must be a positive integer')
    }

    const deleted = await deleteItem(db, id)
    if (!deleted) {
      return notFoundResponse(c, `Item not found: id=${id}`)
    }

    return successResponse(c, { message: 'Item deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/items/:id error:', error)
    return serverErrorResponse(c)
  }
}
