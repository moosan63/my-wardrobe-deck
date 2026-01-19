import { describe, it, expect } from 'vitest'
import {
  createInvalidItemIdError,
  createInvalidItemNameError,
  createInvalidCategoryError,
  createInvalidColorError,
  createItemNotFoundError,
  type ItemError,
} from '../../../../app/src/item/domain/write/errors'

describe('ItemError', () => {
  describe('createInvalidItemIdError', () => {
    it('should create INVALID_ITEM_ID error with message', () => {
      const error = createInvalidItemIdError('ID must be positive')

      expect(error.type).toBe('INVALID_ITEM_ID')
      expect(error.message).toBe('ID must be positive')
    })
  })

  describe('createInvalidItemNameError', () => {
    it('should create INVALID_ITEM_NAME error with message', () => {
      const error = createInvalidItemNameError('Name is required')

      expect(error.type).toBe('INVALID_ITEM_NAME')
      expect(error.message).toBe('Name is required')
    })
  })

  describe('createInvalidCategoryError', () => {
    it('should create INVALID_CATEGORY error with message', () => {
      const error = createInvalidCategoryError('Invalid category')

      expect(error.type).toBe('INVALID_CATEGORY')
      expect(error.message).toBe('Invalid category')
    })
  })

  describe('createInvalidColorError', () => {
    it('should create INVALID_COLOR error with message', () => {
      const error = createInvalidColorError('Color is required')

      expect(error.type).toBe('INVALID_COLOR')
      expect(error.message).toBe('Color is required')
    })
  })

  describe('createItemNotFoundError', () => {
    it('should create ITEM_NOT_FOUND error with id', () => {
      const error = createItemNotFoundError(123)

      expect(error.type).toBe('ITEM_NOT_FOUND')
      expect(error.id).toBe(123)
    })
  })

  describe('type checking', () => {
    it('should allow ItemError union type', () => {
      const errors: ItemError[] = [
        createInvalidItemIdError('test'),
        createInvalidItemNameError('test'),
        createInvalidCategoryError('test'),
        createInvalidColorError('test'),
        createItemNotFoundError(1),
      ]

      expect(errors).toHaveLength(5)
    })
  })
})
