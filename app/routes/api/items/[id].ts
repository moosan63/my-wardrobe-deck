import { Hono } from 'hono'
import { getItemById, updateItem, deleteItem } from '../../../db/items'
import { updateItemSchema } from '../../../lib/validation'
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
} from '../../../lib/api-response'

const app = new Hono()

/**
 * IDパラメータをパースして数値に変換
 * 無効な場合はnullを返す
 */
function parseId(idParam: string): number | null {
  const id = parseInt(idParam, 10)
  if (isNaN(id) || id <= 0) {
    return null
  }
  return id
}

/**
 * GET /api/items/:id
 * IDでアイテムを取得
 */
app.get('/', async (c) => {
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
})

/**
 * PUT /api/items/:id
 * アイテムを更新
 */
app.put('/', async (c) => {
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
})

/**
 * DELETE /api/items/:id
 * アイテムを削除
 */
app.delete('/', async (c) => {
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
})

export default app
