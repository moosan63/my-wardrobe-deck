import { describe, it, expect } from 'vitest'
import { ItemId } from '../../../../app/src/item/domain/write/item-id'

describe('ItemId', () => {
  describe('create', () => {
    it('should create ItemId with valid positive integer', () => {
      const result = ItemId.create(1)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe(1)
      }
    })

    it('should create ItemId with large positive integer', () => {
      const result = ItemId.create(999999)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe(999999)
      }
    })

    it('should fail with zero', () => {
      const result = ItemId.create(0)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
        expect(result.error.message).toContain('positive')
      }
    })

    it('should fail with negative number', () => {
      const result = ItemId.create(-1)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
      }
    })

    it('should fail with non-integer', () => {
      const result = ItemId.create(1.5)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_ID')
        expect(result.error.message).toContain('integer')
      }
    })
  })

  describe('reconstitute', () => {
    it('should reconstitute ItemId without validation', () => {
      const itemId = ItemId.reconstitute(42)

      expect(itemId.value).toBe(42)
    })
  })

  describe('equals', () => {
    it('should return true for same id values', () => {
      const id1 = ItemId.reconstitute(1)
      const id2 = ItemId.reconstitute(1)

      expect(id1.equals(id2)).toBe(true)
    })

    it('should return false for different id values', () => {
      const id1 = ItemId.reconstitute(1)
      const id2 = ItemId.reconstitute(2)

      expect(id1.equals(id2)).toBe(false)
    })
  })
})
