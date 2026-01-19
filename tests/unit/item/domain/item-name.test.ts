import { describe, it, expect } from 'vitest'
import { ItemName } from '../../../../app/src/item/domain/write/item-name'

describe('ItemName', () => {
  describe('create', () => {
    it('should create ItemName with valid name', () => {
      const result = ItemName.create('White T-Shirt')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('White T-Shirt')
      }
    })

    it('should create ItemName with trimmed name', () => {
      const result = ItemName.create('  White T-Shirt  ')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('White T-Shirt')
      }
    })

    it('should create ItemName with exactly 100 characters', () => {
      const longName = 'a'.repeat(100)
      const result = ItemName.create(longName)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe(longName)
      }
    })

    it('should fail with empty string', () => {
      const result = ItemName.create('')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_NAME')
        expect(result.error.message).toContain('empty')
      }
    })

    it('should fail with whitespace only', () => {
      const result = ItemName.create('   ')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_NAME')
        expect(result.error.message).toContain('empty')
      }
    })

    it('should fail with more than 100 characters', () => {
      const longName = 'a'.repeat(101)
      const result = ItemName.create(longName)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_NAME')
        expect(result.error.message).toContain('100')
      }
    })
  })

  describe('reconstitute', () => {
    it('should reconstitute ItemName without validation', () => {
      const itemName = ItemName.reconstitute('Any Name')

      expect(itemName.value).toBe('Any Name')
    })
  })

  describe('equals', () => {
    it('should return true for same name values', () => {
      const name1 = ItemName.reconstitute('Shirt')
      const name2 = ItemName.reconstitute('Shirt')

      expect(name1.equals(name2)).toBe(true)
    })

    it('should return false for different name values', () => {
      const name1 = ItemName.reconstitute('Shirt')
      const name2 = ItemName.reconstitute('Pants')

      expect(name1.equals(name2)).toBe(false)
    })
  })
})
