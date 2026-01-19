/**
 * D1ItemRepository 統合テスト
 * Write側リポジトリの実装を検証
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { env } from 'cloudflare:test'
import { D1ItemRepository } from '../../../app/infrastructure/d1/item-repository-impl'
import { Item, ItemId } from '../../../app/src/item/domain'

// テスト用のスキーマをセットアップ
async function setupSchema(db: D1Database) {
  await db.exec(
    "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT NOT NULL CHECK (category IN ('outer','tops','bottoms','shoes','accessories')), color TEXT NOT NULL, brand TEXT, description TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))"
  )
}

// テストデータをクリア
async function clearItems(db: D1Database) {
  await db.exec('DELETE FROM items')
}

describe('D1ItemRepository', () => {
  let repository: D1ItemRepository

  beforeEach(async () => {
    await setupSchema(env.DB)
    await clearItems(env.DB)
    repository = new D1ItemRepository(env.DB)
  })

  describe('save - 新規作成', () => {
    it('新しいアイテムを作成してIDを割り当てる', async () => {
      const itemResult = Item.create({
        name: 'テストコート',
        category: 'outer',
        color: 'ネイビー',
        brand: 'Test Brand',
        description: 'テスト説明文',
      })
      expect(itemResult.isOk()).toBe(true)
      const item = itemResult._unsafeUnwrap()

      const result = await repository.save(item)

      expect(result.isOk()).toBe(true)
      const savedItem = result._unsafeUnwrap()
      expect(savedItem.hasId()).toBe(true)
      expect(savedItem.id.value).toBeGreaterThan(0)
      expect(savedItem.name.value).toBe('テストコート')
      expect(savedItem.category.value).toBe('outer')
      expect(savedItem.color.value).toBe('ネイビー')
      expect(savedItem.brand).toBe('Test Brand')
      expect(savedItem.description).toBe('テスト説明文')
    })

    it('オプションフィールドなしでアイテムを作成できる', async () => {
      const itemResult = Item.create({
        name: 'シンプルTシャツ',
        category: 'tops',
        color: '白',
      })
      expect(itemResult.isOk()).toBe(true)
      const item = itemResult._unsafeUnwrap()

      const result = await repository.save(item)

      expect(result.isOk()).toBe(true)
      const savedItem = result._unsafeUnwrap()
      expect(savedItem.name.value).toBe('シンプルTシャツ')
      expect(savedItem.brand).toBeNull()
      expect(savedItem.description).toBeNull()
    })
  })

  describe('save - 更新', () => {
    it('既存のアイテムを更新できる', async () => {
      // まず作成
      const itemResult = Item.create({
        name: '元の名前',
        category: 'tops',
        color: '白',
      })
      const item = itemResult._unsafeUnwrap()
      const saveResult = await repository.save(item)
      const savedItem = saveResult._unsafeUnwrap()

      // 更新
      savedItem.updateName('更新後の名前')
      savedItem.updateColor('黒')

      const updateResult = await repository.save(savedItem)

      expect(updateResult.isOk()).toBe(true)
      const updatedItem = updateResult._unsafeUnwrap()
      expect(updatedItem.name.value).toBe('更新後の名前')
      expect(updatedItem.color.value).toBe('黒')
      expect(updatedItem.category.value).toBe('tops') // 未更新フィールドは維持
    })

    it('全てのフィールドを更新できる', async () => {
      const itemResult = Item.create({
        name: '元の名前',
        category: 'tops',
        color: '白',
      })
      const item = itemResult._unsafeUnwrap()
      const saveResult = await repository.save(item)
      const savedItem = saveResult._unsafeUnwrap()

      savedItem.updateName('新しい名前')
      savedItem.updateCategory('outer')
      savedItem.updateColor('黒')
      savedItem.updateBrand('新しいブランド')
      savedItem.updateDescription('新しい説明')

      const updateResult = await repository.save(savedItem)

      expect(updateResult.isOk()).toBe(true)
      const updatedItem = updateResult._unsafeUnwrap()
      expect(updatedItem.name.value).toBe('新しい名前')
      expect(updatedItem.category.value).toBe('outer')
      expect(updatedItem.color.value).toBe('黒')
      expect(updatedItem.brand).toBe('新しいブランド')
      expect(updatedItem.description).toBe('新しい説明')
    })

    it('brandをnullで明示的に更新できる', async () => {
      const itemResult = Item.create({
        name: 'テスト',
        category: 'tops',
        color: '白',
        brand: '既存ブランド',
      })
      const item = itemResult._unsafeUnwrap()
      const saveResult = await repository.save(item)
      const savedItem = saveResult._unsafeUnwrap()

      savedItem.updateBrand(null)

      const updateResult = await repository.save(savedItem)

      expect(updateResult.isOk()).toBe(true)
      const updatedItem = updateResult._unsafeUnwrap()
      expect(updatedItem.brand).toBeNull()
    })
  })

  describe('findById', () => {
    it('IDでアイテムを取得できる', async () => {
      const itemResult = Item.create({
        name: 'テストシューズ',
        category: 'shoes',
        color: '茶',
        brand: 'Shoe Brand',
      })
      const item = itemResult._unsafeUnwrap()
      const saveResult = await repository.save(item)
      const savedItem = saveResult._unsafeUnwrap()

      const findResult = await repository.findById(savedItem.id)

      expect(findResult.isOk()).toBe(true)
      const foundItem = findResult._unsafeUnwrap()
      expect(foundItem).not.toBeNull()
      expect(foundItem!.id.equals(savedItem.id)).toBe(true)
      expect(foundItem!.name.value).toBe('テストシューズ')
      expect(foundItem!.category.value).toBe('shoes')
    })

    it('存在しないIDの場合はnullを返す', async () => {
      const idResult = ItemId.create(99999)
      expect(idResult.isOk()).toBe(true)
      const id = idResult._unsafeUnwrap()

      const findResult = await repository.findById(id)

      expect(findResult.isOk()).toBe(true)
      const foundItem = findResult._unsafeUnwrap()
      expect(foundItem).toBeNull()
    })
  })

  describe('delete', () => {
    it('アイテムを削除できる', async () => {
      const itemResult = Item.create({
        name: '削除対象',
        category: 'bottoms',
        color: '青',
      })
      const item = itemResult._unsafeUnwrap()
      const saveResult = await repository.save(item)
      const savedItem = saveResult._unsafeUnwrap()

      const deleteResult = await repository.delete(savedItem.id)

      expect(deleteResult.isOk()).toBe(true)
      expect(deleteResult._unsafeUnwrap()).toBe(true)

      // 削除されていることを確認
      const findResult = await repository.findById(savedItem.id)
      expect(findResult.isOk()).toBe(true)
      expect(findResult._unsafeUnwrap()).toBeNull()
    })

    it('存在しないIDの場合はfalseを返す', async () => {
      const idResult = ItemId.create(99999)
      expect(idResult.isOk()).toBe(true)
      const id = idResult._unsafeUnwrap()

      const deleteResult = await repository.delete(id)

      expect(deleteResult.isOk()).toBe(true)
      expect(deleteResult._unsafeUnwrap()).toBe(false)
    })
  })
})
