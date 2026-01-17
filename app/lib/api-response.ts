import type { Context } from 'hono'

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
