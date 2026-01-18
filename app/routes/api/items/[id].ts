import { createRoute } from 'honox/factory'
import { getItemHandler, putItemHandler, deleteItemHandler } from '../../../lib/items-handlers'

/**
 * GET /api/items/:id
 * IDでアイテムを取得
 */
export const GET = createRoute(getItemHandler)

/**
 * PUT /api/items/:id
 * アイテムを更新
 */
export const PUT = createRoute(putItemHandler)

/**
 * DELETE /api/items/:id
 * アイテムを削除
 */
export const DELETE = createRoute(deleteItemHandler)
