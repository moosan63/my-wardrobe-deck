import type { Context } from 'hono'
import type { ItemError } from '../src/item/domain'
import type { DatabaseError } from '../shared/errors'

/**
 * APIレスポンスの共通フォーマット
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
  }
}

/**
 * ユースケース層から返されるエラー型の共用型
 */
export type UsecaseError = ItemError | DatabaseError

/**
 * 成功レスポンスを返す（200 OK）
 */
export function successResponse<T>(c: Context, data: T): Response {
  return c.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    200
  )
}

/**
 * 作成成功レスポンスを返す（201 Created）
 */
export function createdResponse<T>(c: Context, data: T): Response {
  return c.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    201
  )
}

/**
 * バリデーションエラーレスポンスを返す（400 Bad Request）
 */
export function badRequestResponse(c: Context, message: string): Response {
  return c.json<ApiResponse>(
    {
      success: false,
      error: { message },
    },
    400
  )
}

/**
 * Not Foundエラーレスポンスを返す（404 Not Found）
 */
export function notFoundResponse(c: Context, message: string): Response {
  return c.json<ApiResponse>(
    {
      success: false,
      error: { message },
    },
    404
  )
}

/**
 * サーバーエラーレスポンスを返す（500 Internal Server Error）
 */
export function serverErrorResponse(c: Context, message: string = 'Internal server error'): Response {
  return c.json<ApiResponse>(
    {
      success: false,
      error: { message },
    },
    500
  )
}

/**
 * UsecaseErrorをHTTPレスポンスに変換する
 * エラーからHTTPステータスへのマッピング:
 * - INVALID_ITEM_ID, INVALID_ITEM_NAME, INVALID_CATEGORY, INVALID_COLOR: 400 Bad Request
 * - ITEM_NOT_FOUND: 404 Not Found
 * - DATABASE_ERROR: 500 Internal Server Error
 */
export function errorToResponse(c: Context, error: UsecaseError): Response {
  switch (error.type) {
    case 'INVALID_ITEM_ID':
      return badRequestResponse(c, `Invalid id: ${error.message}`)
    case 'INVALID_ITEM_NAME':
      return badRequestResponse(c, `name: ${error.message}`)
    case 'INVALID_CATEGORY':
      return badRequestResponse(c, `category: ${error.message}`)
    case 'INVALID_COLOR':
      return badRequestResponse(c, `color: ${error.message}`)
    case 'ITEM_NOT_FOUND':
      return notFoundResponse(c, `Item not found: id=${error.id}`)
    case 'DATABASE_ERROR':
      console.error('Database error:', error.cause)
      return serverErrorResponse(c)
    default:
      // 未知のエラー型の場合は500を返す
      console.error('Unknown error:', error)
      return serverErrorResponse(c)
  }
}
