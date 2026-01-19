/**
 * UpdateItem ユースケーステスト
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { okAsync, errAsync } from '../../../../app/shared/result'
import { UpdateItem, UpdateItemInput } from '../../../../app/src/item/usecases/update-item'
import type { ItemRepository } from '../../../../app/src/item/repositories/item-repository'
import type { ItemReadRepository } from '../../../../app/src/item/repositories/item-read-repository'
import { Item, ItemId, ItemName, Category, Color, createItemNotFoundError } from '../../../../app/src/item/domain'
import type { ItemReadModel } from '../../../../app/src/item/domain'
import { createDatabaseError } from '../../../../app/shared/errors'

describe('UpdateItem', () => {
  let mockItemRepository: ItemRepository
  let mockItemReadRepository: ItemReadRepository
  let updateItem: UpdateItem

  const createExistingItem = (): Item => {
    return Item.reconstitute({
      id: ItemId.reconstitute(1),
      name: ItemName.reconstitute('Original Name'),
      category: Category.reconstitute('tops'),
      color: Color.reconstitute('white'),
      brand: 'Original Brand',
      description: 'Original Description',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    })
  }

  const createUpdatedReadModel = (overrides: Partial<ItemReadModel> = {}): ItemReadModel => ({
    id: 1,
    name: 'Updated Name',
    category: 'outer',
    color: 'black',
    brand: 'Updated Brand',
    description: 'Updated Description',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    ...overrides,
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
    updateItem = new UpdateItem(mockItemRepository, mockItemReadRepository)
  })

  describe('execute', () => {
    it('should update all fields and return ItemReadModel', async () => {
      const existingItem = createExistingItem()
      const input: UpdateItemInput = {
        id: 1,
        name: 'Updated Name',
        category: 'outer',
        color: 'black',
        brand: 'Updated Brand',
        description: 'Updated Description',
      }

      vi.mocked(mockItemRepository.findById).mockReturnValue(okAsync(existingItem))
      vi.mocked(mockItemRepository.save).mockImplementation((item) => okAsync(item))
      vi.mocked(mockItemReadRepository.findById).mockReturnValue(okAsync(createUpdatedReadModel()))

      const result = await updateItem.execute(input)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.id).toBe(1)
        expect(result.value.name).toBe('Updated Name')
        expect(result.value.category).toBe('outer')
        expect(result.value.color).toBe('black')
        expect(result.value.brand).toBe('Updated Brand')
        expect(result.value.description).toBe('Updated Description')
      }

      expect(mockItemRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockItemRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should update only provided fields', async () => {
      const existingItem = createExistingItem()
      const input: UpdateItemInput = {
        id: 1,
        name: 'Only Name Updated',
      }

      vi.mocked(mockItemRepository.findById).mockReturnValue(okAsync(existingItem))
      vi.mocked(mockItemRepository.save).mockImplementation((item) => okAsync(item))
      vi.mocked(mockItemReadRepository.findById).mockReturnValue(
        okAsync(createUpdatedReadModel({ name: 'Only Name Updated', category: 'tops', color: 'white', brand: 'Original Brand', description: 'Original Description' }))
      )

      const result = await updateItem.execute(input)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.name).toBe('Only Name Updated')
        // Other fields remain unchanged
        expect(result.value.category).toBe('tops')
        expect(result.value.color).toBe('white')
      }
    })

    it('should update brand to null', async () => {
      const existingItem = createExistingItem()
      const input: UpdateItemInput = {
        id: 1,
        brand: null,
      }

      vi.mocked(mockItemRepository.findById).mockReturnValue(okAsync(existingItem))
      vi.mocked(mockItemRepository.save).mockImplementation((item) => okAsync(item))
      vi.mocked(mockItemReadRepository.findById).mockReturnValue(
        okAsync(createUpdatedReadModel({ brand: null }))
      )

      const result = await updateItem.execute(input)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.brand).toBeNull()
      }
    })

    it('should fail when item not found', async () => {
      const input: UpdateItemInput = {
        id: 999,
        name: 'Updated Name',
      }

      vi.mocked(mockItemRepository.findById).mockReturnValue(okAsync(null))

      const result = await updateItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('ITEM_NOT_FOUND')
        if (result.error.type === 'ITEM_NOT_FOUND') {
          expect(result.error.id).toBe(999)
        }
      }

      expect(mockItemRepository.save).not.toHaveBeenCalled()
    })

    it('should fail with invalid id (non-positive)', async () => {
      const input: UpdateItemInput = {
        id: 0,
        name: 'Test',
      }

      const result = await updateItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
      }

      expect(mockItemRepository.findById).not.toHaveBeenCalled()
    })

    it('should fail with invalid name (empty)', async () => {
      const existingItem = createExistingItem()
      const input: UpdateItemInput = {
        id: 1,
        name: '',
      }

      vi.mocked(mockItemRepository.findById).mockReturnValue(okAsync(existingItem))

      const result = await updateItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_NAME')
      }

      expect(mockItemRepository.save).not.toHaveBeenCalled()
    })

    it('should fail with invalid category', async () => {
      const existingItem = createExistingItem()
      const input: UpdateItemInput = {
        id: 1,
        category: 'invalid' as any,
      }

      vi.mocked(mockItemRepository.findById).mockReturnValue(okAsync(existingItem))

      const result = await updateItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_CATEGORY')
      }

      expect(mockItemRepository.save).not.toHaveBeenCalled()
    })

    it('should fail with invalid color (empty)', async () => {
      const existingItem = createExistingItem()
      const input: UpdateItemInput = {
        id: 1,
        color: '',
      }

      vi.mocked(mockItemRepository.findById).mockReturnValue(okAsync(existingItem))

      const result = await updateItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_COLOR')
      }

      expect(mockItemRepository.save).not.toHaveBeenCalled()
    })

    it('should propagate repository findById error', async () => {
      const dbError = createDatabaseError(new Error('DB connection failed'))
      const input: UpdateItemInput = {
        id: 1,
        name: 'Test',
      }

      vi.mocked(mockItemRepository.findById).mockReturnValue(errAsync(dbError))

      const result = await updateItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('DATABASE_ERROR')
      }
    })

    it('should propagate repository save error', async () => {
      const existingItem = createExistingItem()
      const dbError = createDatabaseError(new Error('DB write failed'))
      const input: UpdateItemInput = {
        id: 1,
        name: 'Test',
      }

      vi.mocked(mockItemRepository.findById).mockReturnValue(okAsync(existingItem))
      vi.mocked(mockItemRepository.save).mockReturnValue(errAsync(dbError))

      const result = await updateItem.execute(input)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('DATABASE_ERROR')
      }
    })
  })
})
