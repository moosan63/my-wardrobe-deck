/**
 * Neverthrow の Result 型を再エクスポート
 * アプリケーション全体で統一したエラーハンドリングを提供
 */
export {
  ok,
  err,
  Ok,
  Err,
  Result,
  ResultAsync,
  okAsync,
  errAsync,
  fromPromise,
  fromThrowable,
  safeTry,
} from 'neverthrow'

export type { Result as ResultType, ResultAsync as ResultAsyncType } from 'neverthrow'
