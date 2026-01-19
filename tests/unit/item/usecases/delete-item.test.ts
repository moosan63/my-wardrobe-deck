/**
 * DeleteItem ユースケーステスト
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { okAsync, errAsync } from '../../../../app/shared/result'
import { DeleteItem } from '../../../../app/src/item/usecases/delete-item'
import type { ItemRepository } from '../../../../app/src/item/repositories/item-repository'
import { ItemId } from '../../../../app/src/item/domain'
import { createDatabaseError } from '../../../../app/shared/errors'

describe('DeleteItem', () => {
  let mockItemRepository: ItemRepository
  let deleteItem: DeleteItem

  beforeEach(() => {
    mockItemRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    }
    deleteItem = new DeleteItem(mockItemRepository)
  })

  describe('execute', () => {
    it('should delete an item successfully', async () => {
      vi.mocked(mockItemRepository.delete).mockReturnValue(okAsync(true))

      const result = await deleteItem.execute(1)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value).toBeUndefined()
      }

      expect(mockItemRepository.delete).toHaveBeenCalledTimes(1)
      // Verify the ItemId was created correctly
      const call = vi.mocked(mockItemRepository.delete).mock.calls[0]
      expect(call[0]).toBeInstanceOf(ItemId)
      expect(call[0].value).toBe(1)
    })

    it('should fail when item not found', async () => {
      vi.mocked(mockItemRepository.delete).mockReturnValue(okAsync(false))

      const result = await deleteItem.execute(999)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('ITEM_NOT_FOUND')
        if (result.error.type === 'ITEM_NOT_FOUND') {
          expect(result.error.id).toBe(999)
        }
      }
    })

    it('should fail with invalid id (non-positive)', async () => {
      const result = await deleteItem.execute(0)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
      }

      expect(mockItemRepository.delete).not.toHaveBeenCalled()
    })

    it('should fail with invalid id (negative)', async () => {
      const result = await deleteItem.execute(-1)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
      }

      expect(mockItemRepository.delete).not.toHaveBeenCalled()
    })

    it('should fail with invalid id (non-integer)', async () => {
      const result = await deleteItem.execute(1.5)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
      }

      expect(mockItemRepository.delete).not.toHaveBeenCalled()
    })

    it('should propagate repository delete error', async () => {
      const dbError = createDatabaseError(new Error('DB connection failed'))
      vi.mocked(mockItemRepository.delete).mockReturnValue(errAsync(dbError))

      const result = await deleteItem.execute(1)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('DATABASE_ERROR')
      }
    })
  })
})
