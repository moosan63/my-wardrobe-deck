/**
 * 共通エラー型定義
 * 各ドメインのエラー型はこれを拡張する
 */

/**
 * データベースエラー
 */
export interface DatabaseError {
  type: 'DATABASE_ERROR'
  cause: unknown
}

/**
 * DatabaseError を作成するヘルパー
 */
export function createDatabaseError(cause: unknown): DatabaseError {
  return {
    type: 'DATABASE_ERROR',
    cause,
  }
}
