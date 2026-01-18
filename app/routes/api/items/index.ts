import { createRoute } from 'honox/factory'
import { getItemsHandler, postItemsHandler } from '../../../lib/items-handlers'

/**
 * GET /api/items
 * 全アイテムを取得（categoryクエリパラメータでフィルタリング可能）
 */
export const GET = createRoute(getItemsHandler)

/**
 * POST /api/items
 * 新しいアイテムを作成
 */
export const POST = createRoute(postItemsHandler)
