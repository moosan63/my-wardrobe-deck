/**
 * GetItem ユースケーステスト
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { okAsync, errAsync } from '../../../../app/shared/result'
import { GetItem } from '../../../../app/src/item/usecases/get-item'
import type { ItemReadRepository } from '../../../../app/src/item/repositories/item-read-repository'
import type { ItemReadModel } from '../../../../app/src/item/domain'
import { createDatabaseError } from '../../../../app/shared/errors'

describe('GetItem', () => {
  let mockItemReadRepository: ItemReadRepository
  let getItem: GetItem

  const createMockReadModel = (): ItemReadModel => ({
    id: 1,
    name: 'Test Item',
    category: 'tops',
    color: 'white',
    brand: 'Test Brand',
    description: 'Test Description',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  })

  beforeEach(() => {
    mockItemReadRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByCategory: vi.fn(),
    }
    getItem = new GetItem(mockItemReadRepository)
  })

  describe('execute', () => {
    it('should return ItemReadModel when found', async () => {
      const readModel = createMockReadModel()
      vi.mocked(mockItemReadRepository.findById).mockReturnValue(okAsync(readModel))

      const result = await getItem.execute(1)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.id).toBe(1)
        expect(result.value.name).toBe('Test Item')
        expect(result.value.category).toBe('tops')
        expect(result.value.color).toBe('white')
        expect(result.value.brand).toBe('Test Brand')
        expect(result.value.description).toBe('Test Description')
      }

      expect(mockItemReadRepository.findById).toHaveBeenCalledWith(1)
    })

    it('should fail when item not found', async () => {
      vi.mocked(mockItemReadRepository.findById).mockReturnValue(okAsync(null))

      const result = await getItem.execute(999)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('ITEM_NOT_FOUND')
        if (result.error.type === 'ITEM_NOT_FOUND') {
          expect(result.error.id).toBe(999)
        }
      }
    })

    it('should fail with invalid id (non-positive)', async () => {
      const result = await getItem.execute(0)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
      }

      expect(mockItemReadRepository.findById).not.toHaveBeenCalled()
    })

    it('should fail with invalid id (negative)', async () => {
      const result = await getItem.execute(-1)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
      }

      expect(mockItemReadRepository.findById).not.toHaveBeenCalled()
    })

    it('should fail with invalid id (non-integer)', async () => {
      const result = await getItem.execute(1.5)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
      }

      expect(mockItemReadRepository.findById).not.toHaveBeenCalled()
    })

    it('should propagate repository error', async () => {
      const dbError = createDatabaseError(new Error('DB connection failed'))
      vi.mocked(mockItemReadRepository.findById).mockReturnValue(errAsync(dbError))

      const result = await getItem.execute(1)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('DATABASE_ERROR')
      }
    })
  })
})
