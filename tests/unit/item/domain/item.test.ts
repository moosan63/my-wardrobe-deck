import { describe, it, expect } from 'vitest'
import { Item } from '../../../../app/src/item/domain/write/item'
import { ItemId } from '../../../../app/src/item/domain/write/item-id'
import { ItemName } from '../../../../app/src/item/domain/write/item-name'
import { Category } from '../../../../app/src/item/domain/write/category'
import { Color } from '../../../../app/src/item/domain/write/color'

describe('Item', () => {
  describe('create', () => {
    it('should create Item with valid required fields', () => {
      const result = Item.create({
        name: 'White T-Shirt',
        category: 'tops',
        color: 'white',
      })

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.name.value).toBe('White T-Shirt')
        expect(result.value.category.value).toBe('tops')
        expect(result.value.color.value).toBe('white')
        expect(result.value.brand).toBeNull()
        expect(result.value.description).toBeNull()
      }
    })

    it('should create Item with all fields', () => {
      const result = Item.create({
        name: 'Navy Jacket',
        category: 'outer',
        color: 'navy',
        brand: 'UNIQLO',
        description: 'Light weight jacket',
      })

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.brand).toBe('UNIQLO')
        expect(result.value.description).toBe('Light weight jacket')
      }
    })

    it('should fail with invalid name', () => {
      const result = Item.create({
        name: '',
        category: 'tops',
        color: 'white',
      })

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_NAME')
      }
    })

    it('should fail with invalid category', () => {
      const result = Item.create({
        name: 'T-Shirt',
        category: 'invalid',
        color: 'white',
      })

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_CATEGORY')
      }
    })

    it('should fail with invalid color', () => {
      const result = Item.create({
        name: 'T-Shirt',
        category: 'tops',
        color: '',
      })

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_COLOR')
      }
    })
  })

  describe('reconstitute', () => {
    it('should reconstitute Item from persisted data', () => {
      const createdAt = new Date('2024-01-01T00:00:00Z')
      const updatedAt = new Date('2024-01-02T00:00:00Z')

      const item = Item.reconstitute({
        id: ItemId.reconstitute(1),
        name: ItemName.reconstitute('Black Jeans'),
        category: Category.reconstitute('bottoms'),
        color: Color.reconstitute('black'),
        brand: 'Levi\'s',
        description: 'Slim fit',
        createdAt,
        updatedAt,
      })

      expect(item.id.value).toBe(1)
      expect(item.name.value).toBe('Black Jeans')
      expect(item.category.value).toBe('bottoms')
      expect(item.color.value).toBe('black')
      expect(item.brand).toBe('Levi\'s')
      expect(item.description).toBe('Slim fit')
      expect(item.createdAt).toEqual(createdAt)
      expect(item.updatedAt).toEqual(updatedAt)
    })
  })

  describe('updateName', () => {
    it('should update name with valid value', () => {
      const item = createTestItem()
      const result = item.updateName('Updated Name')

      expect(result.isOk()).toBe(true)
      expect(item.name.value).toBe('Updated Name')
    })

    it('should fail with invalid name', () => {
      const item = createTestItem()
      const result = item.updateName('')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_ITEM_NAME')
      }
    })
  })

  describe('updateCategory', () => {
    it('should update category with valid value', () => {
      const item = createTestItem()
      const result = item.updateCategory('shoes')

      expect(result.isOk()).toBe(true)
      expect(item.category.value).toBe('shoes')
    })

    it('should fail with invalid category', () => {
      const item = createTestItem()
      const result = item.updateCategory('invalid')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_CATEGORY')
      }
    })
  })

  describe('updateColor', () => {
    it('should update color with valid value', () => {
      const item = createTestItem()
      const result = item.updateColor('red')

      expect(result.isOk()).toBe(true)
      expect(item.color.value).toBe('red')
    })

    it('should fail with invalid color', () => {
      const item = createTestItem()
      const result = item.updateColor('')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_COLOR')
      }
    })
  })

  describe('updateBrand', () => {
    it('should update brand with value', () => {
      const item = createTestItem()
      item.updateBrand('NewBrand')

      expect(item.brand).toBe('NewBrand')
    })

    it('should update brand to null', () => {
      const itemWithBrand = Item.reconstitute({
        id: ItemId.reconstitute(1),
        name: ItemName.reconstitute('Test'),
        category: Category.reconstitute('tops'),
        color: Color.reconstitute('white'),
        brand: 'OldBrand',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      itemWithBrand.updateBrand(null)

      expect(itemWithBrand.brand).toBeNull()
    })
  })

  describe('updateDescription', () => {
    it('should update description with value', () => {
      const item = createTestItem()
      item.updateDescription('New description')

      expect(item.description).toBe('New description')
    })

    it('should update description to null', () => {
      const itemWithDesc = Item.reconstitute({
        id: ItemId.reconstitute(1),
        name: ItemName.reconstitute('Test'),
        category: Category.reconstitute('tops'),
        color: Color.reconstitute('white'),
        brand: null,
        description: 'Old description',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      itemWithDesc.updateDescription(null)

      expect(itemWithDesc.description).toBeNull()
    })
  })

  describe('hasId', () => {
    it('should return true for reconstituted item with id', () => {
      const item = createTestItem()
      expect(item.hasId()).toBe(true)
    })

    it('should return false for newly created item', () => {
      const result = Item.create({
        name: 'Test',
        category: 'tops',
        color: 'white',
      })

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.hasId()).toBe(false)
      }
    })
  })

  describe('assignId', () => {
    it('should assign id to newly created item', () => {
      const result = Item.create({
        name: 'Test',
        category: 'tops',
        color: 'white',
      })

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        const item = result.value
        const assignResult = item.assignId(ItemId.reconstitute(42))

        expect(assignResult.isOk()).toBe(true)
        expect(item.hasId()).toBe(true)
        expect(item.id.value).toBe(42)
      }
    })

    it('should fail to assign id to item that already has id', () => {
      const item = createTestItem()
      const assignResult = item.assignId(ItemId.reconstitute(99))

      expect(assignResult.isErr()).toBe(true)
    })
  })
})

/**
 * テスト用ヘルパー: 永続化済みのItemを作成
 */
function createTestItem(): Item {
  return Item.reconstitute({
    id: ItemId.reconstitute(1),
    name: ItemName.reconstitute('Test Item'),
    category: Category.reconstitute('tops'),
    color: Color.reconstitute('white'),
    brand: null,
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}
