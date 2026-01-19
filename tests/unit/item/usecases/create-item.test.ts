/**
 * CreateItem ユースケーステスト
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { okAsync, errAsync } from '../../../../app/shared/result'
import { CreateItem, CreateItemInput } from '../../../../app/src/item/usecases/create-item'
import type { ItemRepository } from '../../../../app/src/item/repositories/item-repository'
import type { ItemReadRepository } from '../../../../app/src/item/repositories/item-read-repository'
import { Item, ItemId, ItemName, Category, Color, createItemNotFoundError } from '../../../../app/src/item/domain'
import type { ItemReadModel } from '../../../../app/src/item/domain'
import { createDatabaseError } from '../../../../app/shared/errors'

describe('CreateItem', () => {
  let mockItemRepository: ItemRepository
  let mockItemReadRepository: ItemReadRepository
  let createItem: CreateItem

  const validInput: CreateItemInput = {
    name: 'White T-Shirt',
    category: 'tops',
    color: 'white',
    brand: 'UNIQLO',
    description: 'Cotton T-Shirt',
  }

  const createMockSavedItem = (): Item => {
    return Item.reconstitute({
      id: ItemId.reconstitute(1),
      name: ItemName.reconstitute('White T-Shirt'),
      category: Category.reconstitute('tops'),
      color: Color.reconstitute('white'),
      brand: 'UNIQLO',
      description: 'Cotton T-Shirt',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    })
  }

  const createMockReadModel = (): ItemReadModel => ({
    id: 1,
    name: 'White T-Shirt',
    category: 'tops',
    color: 'white',
    brand: 'UNIQLO',
    description: 'Cotton T-Shirt',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  })

  beforeEach(() => {
    mockItemRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    }
    mockItemReadRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByCategory: vi.fn(),
    }
    createItem = new CreateItem(mockItemRepository, mockItemReadRepository)
  })

  describe('execute', () => {
    it('should create an item and return ItemReadModel', async () => {
      const savedItem = createMockSavedItem()
      const readModel = createMockReadModel()

      vi.mocked(mockItemRepository.save).mockReturnValue(okAsync(savedItem))
      vi.mocked(mockItemReadRepository.findById).mockReturnValue(okAsync(readModel))

      const result = await createItem.execute(validInput)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.id).toBe(1)
        expect(result.value.name).toBe('White T-Shirt')
        expect(result.value.category).toBe('tops')
        expect(result.value.color).toBe('white')
        expect(result.value.brand).toBe('UNIQLO')
        expect(result.value.description).toBe('Cotton T-Shirt')
      }

      expect(mockItemRepository.save).toHaveBeenCalledTimes(1)
      expect(mockItemReadRepository.findById).toHaveBeenCalledWith(1)
    })

    it('should create an item without optional fields', async () => {
      const input: CreateItemInput = {
        name: 'Simple Shirt',
        category: 'tops',
        color: 'black',
      }

      const savedItem = Item.reconstitute({
        id: ItemId.reconstitute(2),
        name: ItemName.reconstitute('Simple Shirt'),
        category: Category.reconstitute('tops'),
        color: Color.reconstitute('black'),
        brand: null,
        description: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      })

      const readModel: ItemReadModel = {
        id: 2,
        name: 'Simple Shirt',
        category: 'tops',
        color: 'black',
        brand: null,
        description: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }

      vi.mocked(mockItemRepository.save).mockReturnValue(okAsync(savedItem))
      vi.mocked(mockItemReadRepository.findById).mockReturnValue(okAsync(readModel))

      const result = await createItem.execute(input)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.id).toBe(2)
        expect(result.value.brand).toBeNull()
        expect(result.value.description).toBeNull()
      }
    })

    it('should fail with invalid name (empty)', async () => {
      const input: CreateItemInput = {
        name: '',
        category: 'tops',
        color: 'white',
      }

      const result = await createItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_NAME')
      }

      expect(mockItemRepository.save).not.toHaveBeenCalled()
    })

    it('should fail with invalid category', async () => {
      const input: CreateItemInput = {
        name: 'Test',
        category: 'invalid' as any,
        color: 'white',
      }

      const result = await createItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_CATEGORY')
      }

      expect(mockItemRepository.save).not.toHaveBeenCalled()
    })

    it('should fail with invalid color (empty)', async () => {
      const input: CreateItemInput = {
        name: 'Test',
        category: 'tops',
        color: '',
      }

      const result = await createItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_COLOR')
      }

      expect(mockItemRepository.save).not.toHaveBeenCalled()
    })

    it('should propagate repository save error', async () => {
      const dbError = createDatabaseError(new Error('DB connection failed'))
      vi.mocked(mockItemRepository.save).mockReturnValue(errAsync(dbError))

      const result = await createItem.execute(validInput)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('DATABASE_ERROR')
      }
    })

    it('should fail when read model not found after save', async () => {
      const savedItem = createMockSavedItem()

      vi.mocked(mockItemRepository.save).mockReturnValue(okAsync(savedItem))
      vi.mocked(mockItemReadRepository.findById).mockReturnValue(okAsync(null))

      const result = await createItem.execute(validInput)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('ITEM_NOT_FOUND')
      }
    })
  })
})
