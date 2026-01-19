/**
 * ListItems ユースケーステスト
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { okAsync, errAsync } from '../../../../app/shared/result'
import { ListItems } from '../../../../app/src/item/usecases/list-items'
import type { ItemReadRepository } from '../../../../app/src/item/repositories/item-read-repository'
import type { ItemListReadModel } from '../../../../app/src/item/domain'
import { createDatabaseError } from '../../../../app/shared/errors'

describe('ListItems', () => {
  let mockItemReadRepository: ItemReadRepository
  let listItems: ListItems

  const createMockListModels = (): ItemListReadModel[] => [
    {
      id: 1,
      name: 'Item 1',
      category: 'tops',
      color: 'white',
      brand: 'Brand A',
    },
    {
      id: 2,
      name: 'Item 2',
      category: 'bottoms',
      color: 'black',
      brand: null,
    },
    {
      id: 3,
      name: 'Item 3',
      category: 'outer',
      color: 'navy',
      brand: 'Brand B',
    },
  ]

  beforeEach(() => {
    mockItemReadRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByCategory: vi.fn(),
    }
    listItems = new ListItems(mockItemReadRepository)
  })

  describe('execute', () => {
    it('should return all items as ItemListReadModel array', async () => {
      const listModels = createMockListModels()
      vi.mocked(mockItemReadRepository.findAll).mockReturnValue(okAsync(listModels))

      const result = await listItems.execute()

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value).toHaveLength(3)
        expect(result.value[0].id).toBe(1)
        expect(result.value[0].name).toBe('Item 1')
        expect(result.value[0].category).toBe('tops')
        expect(result.value[1].id).toBe(2)
        expect(result.value[1].brand).toBeNull()
        expect(result.value[2].id).toBe(3)
        expect(result.value[2].brand).toBe('Brand B')
      }

      expect(mockItemReadRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should return empty array when no items exist', async () => {
      vi.mocked(mockItemReadRepository.findAll).mockReturnValue(okAsync([]))

      const result = await listItems.execute()

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value).toHaveLength(0)
        expect(result.value).toEqual([])
      }
    })

    it('should propagate repository error', async () => {
      const dbError = createDatabaseError(new Error('DB connection failed'))
      vi.mocked(mockItemReadRepository.findAll).mockReturnValue(errAsync(dbError))

      const result = await listItems.execute()

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('DATABASE_ERROR')
      }
    })
  })
})
