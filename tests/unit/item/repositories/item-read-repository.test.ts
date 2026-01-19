/**
 * ItemReadRepository インターフェーステスト
 * Read側リポジトリの契約を検証
 */
import { describe, it, expect } from 'vitest'
import type { ItemReadRepository } from '../../../../app/src/item/repositories/item-read-repository'
import type { ResultAsync } from '../../../../app/shared/result'
import type { ItemReadModel, ItemListReadModel, CategoryValue } from '../../../../app/src/item/domain'
import type { DatabaseError } from '../../../../app/shared/errors'

describe('ItemReadRepository interface', () => {
  /**
   * インターフェースの型定義が存在することを確認
   */
  it('should define findById method returning ResultAsync<ItemReadModel | null, DatabaseError>', () => {
    const mockRepository: ItemReadRepository = {
      findById: (_id: number): ResultAsync<ItemReadModel | null, DatabaseError> => {
        throw new Error('Not implemented')
      },
      findAll: (): ResultAsync<ItemListReadModel[], DatabaseError> => {
        throw new Error('Not implemented')
      },
      findByCategory: (_category: CategoryValue): ResultAsync<ItemListReadModel[], DatabaseError> => {
        throw new Error('Not implemented')
      },
    }

    expect(mockRepository.findById).toBeDefined()
    expect(typeof mockRepository.findById).toBe('function')
  })

  it('should define findAll method returning ResultAsync<ItemListReadModel[], DatabaseError>', () => {
    const mockRepository: ItemReadRepository = {
      findById: (_id: number): ResultAsync<ItemReadModel | null, DatabaseError> => {
        throw new Error('Not implemented')
      },
      findAll: (): ResultAsync<ItemListReadModel[], DatabaseError> => {
        throw new Error('Not implemented')
      },
      findByCategory: (_category: CategoryValue): ResultAsync<ItemListReadModel[], DatabaseError> => {
        throw new Error('Not implemented')
      },
    }

    expect(mockRepository.findAll).toBeDefined()
    expect(typeof mockRepository.findAll).toBe('function')
  })

  it('should define findByCategory method returning ResultAsync<ItemListReadModel[], DatabaseError>', () => {
    const mockRepository: ItemReadRepository = {
      findById: (_id: number): ResultAsync<ItemReadModel | null, DatabaseError> => {
        throw new Error('Not implemented')
      },
      findAll: (): ResultAsync<ItemListReadModel[], DatabaseError> => {
        throw new Error('Not implemented')
      },
      findByCategory: (_category: CategoryValue): ResultAsync<ItemListReadModel[], DatabaseError> => {
        throw new Error('Not implemented')
      },
    }

    expect(mockRepository.findByCategory).toBeDefined()
    expect(typeof mockRepository.findByCategory).toBe('function')
  })
})
