/**
 * ListItemsByCategory ユースケーステスト
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { okAsync, errAsync } from '../../../../app/shared/result'
import { ListItemsByCategory } from '../../../../app/src/item/usecases/list-items-by-category'
import type { ItemReadRepository } from '../../../../app/src/item/repositories/item-read-repository'
import type { ItemListReadModel, CategoryValue } from '../../../../app/src/item/domain'
import { createDatabaseError } from '../../../../app/shared/errors'

describe('ListItemsByCategory', () => {
  let mockItemReadRepository: ItemReadRepository
  let listItemsByCategory: ListItemsByCategory

  const createMockTopsModels = (): ItemListReadModel[] => [
    {
      id: 1,
      name: 'T-Shirt',
      category: 'tops',
      color: 'white',
      brand: 'Brand A',
    },
    {
      id: 2,
      name: 'Polo Shirt',
      category: 'tops',
      color: 'blue',
      brand: 'Brand B',
    },
  ]

  beforeEach(() => {
    mockItemReadRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByCategory: vi.fn(),
    }
    listItemsByCategory = new ListItemsByCategory(mockItemReadRepository)
  })

  describe('execute', () => {
    it('should return items filtered by category', async () => {
      const topsModels = createMockTopsModels()
      vi.mocked(mockItemReadRepository.findByCategory).mockReturnValue(okAsync(topsModels))

      const result = await listItemsByCategory.execute('tops')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value).toHaveLength(2)
        expect(result.value[0].category).toBe('tops')
        expect(result.value[1].category).toBe('tops')
      }

      expect(mockItemReadRepository.findByCategory).toHaveBeenCalledWith('tops')
    })

    it('should return empty array when no items match category', async () => {
      vi.mocked(mockItemReadRepository.findByCategory).mockReturnValue(okAsync([]))

      const result = await listItemsByCategory.execute('accessories')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value).toHaveLength(0)
        expect(result.value).toEqual([])
      }

      expect(mockItemReadRepository.findByCategory).toHaveBeenCalledWith('accessories')
    })

    it('should work with all valid categories', async () => {
      const categories: CategoryValue[] = ['outer', 'tops', 'bottoms', 'shoes', 'accessories']

      for (const category of categories) {
        vi.mocked(mockItemReadRepository.findByCategory).mockReturnValue(okAsync([]))

        const result = await listItemsByCategory.execute(category)

        expect(result.isOk()).toBe(true)
        expect(mockItemReadRepository.findByCategory).toHaveBeenCalledWith(category)
      }
    })

    it('should fail with invalid category', async () => {
      const result = await listItemsByCategory.execute('invalid' as any)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_CATEGORY')
      }

      expect(mockItemReadRepository.findByCategory).not.toHaveBeenCalled()
    })

    it('should propagate repository error', async () => {
      const dbError = createDatabaseError(new Error('DB connection failed'))
      vi.mocked(mockItemReadRepository.findByCategory).mockReturnValue(errAsync(dbError))

      const result = await listItemsByCategory.execute('tops')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('DATABASE_ERROR')
      }
    })
  })
})
