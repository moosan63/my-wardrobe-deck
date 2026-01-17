import { Hono } from 'hono'
import { getAllItems, getItemsByCategory, createItem } from '../../../db/items'
import { createItemSchema, categorySchema } from '../../../lib/validation'
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  serverErrorResponse,
} from '../../../lib/api-response'
import type { Category } from '../../../types/item'

const app = new Hono()

/**
 * GET /api/items
 * 全アイテムを取得（categoryクエリパラメータでフィルタリング可能）
 */
app.get('/', async (c) => {
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
})

/**
 * POST /api/items
 * 新しいアイテムを作成
 */
app.post('/', async (c) => {
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
})

export default app
