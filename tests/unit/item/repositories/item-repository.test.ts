/**
 * ItemRepository インターフェーステスト
 * Write側リポジトリの契約を検証
 */
import { describe, it, expect } from 'vitest'
import type { ItemRepository } from '../../../../app/src/item/repositories/item-repository'
import type { ResultAsync } from '../../../../app/shared/result'
import type { Item, ItemId, ItemError } from '../../../../app/src/item/domain'
import type { DatabaseError } from '../../../../app/shared/errors'

describe('ItemRepository interface', () => {
  /**
   * インターフェースの型定義が存在することを確認
   * コンパイル時のチェックが主目的
   */
  it('should define save method returning ResultAsync<Item, RepositoryError>', () => {
    // 型チェック用のダミー実装
    const mockRepository: ItemRepository = {
      save: (_item: Item): ResultAsync<Item, ItemError | DatabaseError> => {
        throw new Error('Not implemented')
      },
      findById: (_id: ItemId): ResultAsync<Item | null, ItemError | DatabaseError> => {
        throw new Error('Not implemented')
      },
      delete: (_id: ItemId): ResultAsync<boolean, ItemError | DatabaseError> => {
        throw new Error('Not implemented')
      },
    }

    expect(mockRepository.save).toBeDefined()
    expect(typeof mockRepository.save).toBe('function')
  })

  it('should define findById method returning ResultAsync<Item | null, RepositoryError>', () => {
    const mockRepository: ItemRepository = {
      save: (_item: Item): ResultAsync<Item, ItemError | DatabaseError> => {
        throw new Error('Not implemented')
      },
      findById: (_id: ItemId): ResultAsync<Item | null, ItemError | DatabaseError> => {
        throw new Error('Not implemented')
      },
      delete: (_id: ItemId): ResultAsync<boolean, ItemError | DatabaseError> => {
        throw new Error('Not implemented')
      },
    }

    expect(mockRepository.findById).toBeDefined()
    expect(typeof mockRepository.findById).toBe('function')
  })

  it('should define delete method returning ResultAsync<boolean, RepositoryError>', () => {
    const mockRepository: ItemRepository = {
      save: (_item: Item): ResultAsync<Item, ItemError | DatabaseError> => {
        throw new Error('Not implemented')
      },
      findById: (_id: ItemId): ResultAsync<Item | null, ItemError | DatabaseError> => {
        throw new Error('Not implemented')
      },
      delete: (_id: ItemId): ResultAsync<boolean, ItemError | DatabaseError> => {
        throw new Error('Not implemented')
      },
    }

    expect(mockRepository.delete).toBeDefined()
    expect(typeof mockRepository.delete).toBe('function')
  })
})
