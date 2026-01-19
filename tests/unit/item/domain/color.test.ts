import { describe, it, expect } from 'vitest'
import { Color } from '../../../../app/src/item/domain/write/color'

describe('Color', () => {
  describe('create', () => {
    it('should create Color with valid color string', () => {
      const result = Color.create('white')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('white')
      }
    })

    it('should create Color with trimmed value', () => {
      const result = Color.create('  navy blue  ')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('navy blue')
      }
    })

    it('should create Color with Japanese characters', () => {
      const result = Color.create('ネイビー')

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.value).toBe('ネイビー')
      }
    })

    it('should fail with empty string', () => {
      const result = Color.create('')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_COLOR')
        expect(result.error.message).toContain('empty')
      }
    })

    it('should fail with whitespace only', () => {
      const result = Color.create('   ')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_COLOR')
        expect(result.error.message).toContain('empty')
      }
    })
  })

  describe('reconstitute', () => {
    it('should reconstitute Color without validation', () => {
      const color = Color.reconstitute('black')

      expect(color.value).toBe('black')
    })
  })

  describe('equals', () => {
    it('should return true for same color values', () => {
      const color1 = Color.reconstitute('red')
      const color2 = Color.reconstitute('red')

      expect(color1.equals(color2)).toBe(true)
    })

    it('should return false for different color values', () => {
      const color1 = Color.reconstitute('red')
      const color2 = Color.reconstitute('blue')

      expect(color1.equals(color2)).toBe(false)
    })
  })
})
