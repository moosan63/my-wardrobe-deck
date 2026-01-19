import { describe, it, expect } from 'vitest'
import { Category, VALID_CATEGORIES } from '../../../../app/src/item/domain/write/category'

describe('Category', () => {
  describe('VALID_CATEGORIES', () => {
    it('should contain all valid category values', () => {
      expect(VALID_CATEGORIES).toContain('outer')
      expect(VALID_CATEGORIES).toContain('tops')
      expect(VALID_CATEGORIES).toContain('bottoms')
      expect(VALID_CATEGORIES).toContain('shoes')
      expect(VALID_CATEGORIES).toContain('accessories')
      expect(VALID_CATEGORIES).toHaveLength(5)
    })
  })

  describe('create', () => {
    it('should create Category with "outer"', () => {
      const result = Category.create('outer')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('outer')
      }
    })

    it('should create Category with "tops"', () => {
      const result = Category.create('tops')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('tops')
      }
    })

    it('should create Category with "bottoms"', () => {
      const result = Category.create('bottoms')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('bottoms')
      }
    })

    it('should create Category with "shoes"', () => {
      const result = Category.create('shoes')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('shoes')
      }
    })

    it('should create Category with "accessories"', () => {
      const result = Category.create('accessories')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('accessories')
      }
    })

    it('should fail with invalid category value', () => {
      const result = Category.create('invalid')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_CATEGORY')
        expect(result.error.message).toContain('invalid')
      }
    })

    it('should fail with empty string', () => {
      const result = Category.create('')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_CATEGORY')
      }
    })

    it('should fail with case-sensitive mismatch', () => {
      const result = Category.create('Outer')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_CATEGORY')
      }
    })
  })

  describe('reconstitute', () => {
    it('should reconstitute Category without validation', () => {
      const category = Category.reconstitute('tops')

      expect(category.value).toBe('tops')
    })
  })

  describe('equals', () => {
    it('should return true for same category values', () => {
      const cat1 = Category.reconstitute('outer')
      const cat2 = Category.reconstitute('outer')

      expect(cat1.equals(cat2)).toBe(true)
    })

    it('should return false for different category values', () => {
      const cat1 = Category.reconstitute('outer')
      const cat2 = Category.reconstitute('tops')

      expect(cat1.equals(cat2)).toBe(false)
    })
  })
})
