import { describe, it, expect, beforeEach } from 'vitest'
import { env } from 'cloudflare:test'
import {
  getAllItems,
  getItemById,
  getItemsByCategory,
  createItem,
  updateItem,
  deleteItem,
} from '../../app/db/items'
import type { CreateItemInput, UpdateItemInput } from '../../app/types/item'

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

describe('items DBアクセス層', () => {
  beforeEach(async () => {
    await setupSchema(env.DB)
    await clearItems(env.DB)
  })

  describe('createItem', () => {
    it('アイテムを作成できる', async () => {
      const input: CreateItemInput = {
        name: 'テストコート',
        category: 'outer',
        color: 'ネイビー',
        brand: 'Test Brand',
        description: 'テスト説明文',
      }

      const result = await createItem(env.DB, input)

      expect(result).toBeDefined()
      expect(result.id).toBeGreaterThan(0)
      expect(result.name).toBe('テストコート')
      expect(result.category).toBe('outer')
      expect(result.color).toBe('ネイビー')
      expect(result.brand).toBe('Test Brand')
      expect(result.description).toBe('テスト説明文')
      expect(result.created_at).toBeDefined()
      expect(result.updated_at).toBeDefined()
    })

    it('オプションフィールドなしでもアイテムを作成できる', async () => {
      const input: CreateItemInput = {
        name: 'シンプルTシャツ',
        category: 'tops',
        color: '白',
      }

      const result = await createItem(env.DB, input)

      expect(result).toBeDefined()
      expect(result.name).toBe('シンプルTシャツ')
      expect(result.brand).toBeNull()
      expect(result.description).toBeNull()
    })
  })

  describe('getAllItems', () => {
    it('全アイテムを取得できる', async () => {
      // テストデータ作成
      await createItem(env.DB, {
        name: 'アイテム1',
        category: 'outer',
        color: '黒',
      })
      await createItem(env.DB, {
        name: 'アイテム2',
        category: 'tops',
        color: '白',
      })
      await createItem(env.DB, {
        name: 'アイテム3',
        category: 'bottoms',
        color: '青',
      })

      const items = await getAllItems(env.DB)

      expect(items).toHaveLength(3)
    })

    it('アイテムがない場合は空配列を返す', async () => {
      const items = await getAllItems(env.DB)

      expect(items).toEqual([])
    })
  })

  describe('getItemById', () => {
    it('IDでアイテムを取得できる', async () => {
      const created = await createItem(env.DB, {
        name: 'テストシューズ',
        category: 'shoes',
        color: '茶',
        brand: 'Shoe Brand',
      })

      const item = await getItemById(env.DB, created.id)

      expect(item).toBeDefined()
      expect(item?.id).toBe(created.id)
      expect(item?.name).toBe('テストシューズ')
      expect(item?.category).toBe('shoes')
    })

    it('存在しないIDの場合はnullを返す', async () => {
      const item = await getItemById(env.DB, 99999)

      expect(item).toBeNull()
    })
  })

  describe('getItemsByCategory', () => {
    it('カテゴリでアイテムをフィルタリングできる', async () => {
      await createItem(env.DB, {
        name: 'アウター1',
        category: 'outer',
        color: '黒',
      })
      await createItem(env.DB, {
        name: 'トップス1',
        category: 'tops',
        color: '白',
      })
      await createItem(env.DB, {
        name: 'アウター2',
        category: 'outer',
        color: '紺',
      })

      const outerItems = await getItemsByCategory(env.DB, 'outer')

      expect(outerItems).toHaveLength(2)
      expect(outerItems.every((item) => item.category === 'outer')).toBe(true)
    })

    it('該当カテゴリがない場合は空配列を返す', async () => {
      await createItem(env.DB, {
        name: 'トップス1',
        category: 'tops',
        color: '白',
      })

      const items = await getItemsByCategory(env.DB, 'accessories')

      expect(items).toEqual([])
    })
  })

  describe('updateItem', () => {
    it('アイテムを更新できる', async () => {
      const created = await createItem(env.DB, {
        name: '元の名前',
        category: 'tops',
        color: '白',
      })

      const updateInput: UpdateItemInput = {
        name: '更新後の名前',
        color: '黒',
      }

      const updated = await updateItem(env.DB, created.id, updateInput)

      expect(updated).toBeDefined()
      expect(updated?.name).toBe('更新後の名前')
      expect(updated?.color).toBe('黒')
      expect(updated?.category).toBe('tops') // 未更新フィールドは維持
    })

    it('存在しないIDの場合はnullを返す', async () => {
      const result = await updateItem(env.DB, 99999, { name: '新しい名前' })

      expect(result).toBeNull()
    })

    it('全てのフィールドを更新できる', async () => {
      const created = await createItem(env.DB, {
        name: '元の名前',
        category: 'tops',
        color: '白',
        brand: null,
        description: null,
      })

      const updateInput: UpdateItemInput = {
        name: '新しい名前',
        category: 'outer',
        color: '黒',
        brand: '新しいブランド',
        description: '新しい説明',
      }

      const updated = await updateItem(env.DB, created.id, updateInput)

      expect(updated?.name).toBe('新しい名前')
      expect(updated?.category).toBe('outer')
      expect(updated?.color).toBe('黒')
      expect(updated?.brand).toBe('新しいブランド')
      expect(updated?.description).toBe('新しい説明')
    })

    it('更新時にupdated_atが設定される', async () => {
      const created = await createItem(env.DB, {
        name: 'テスト',
        category: 'tops',
        color: '白',
      })

      const updated = await updateItem(env.DB, created.id, { name: '更新後' })

      expect(updated?.updated_at).toBeDefined()
      expect(typeof updated?.updated_at).toBe('string')
    })

    it('brandをnullで明示的に更新できる', async () => {
      const created = await createItem(env.DB, {
        name: 'テスト',
        category: 'tops',
        color: '白',
        brand: '既存ブランド',
      })

      const updated = await updateItem(env.DB, created.id, { brand: null })

      expect(updated?.brand).toBeNull()
    })
  })

  describe('deleteItem', () => {
    it('アイテムを削除できる', async () => {
      const created = await createItem(env.DB, {
        name: '削除対象',
        category: 'bottoms',
        color: '青',
      })

      const result = await deleteItem(env.DB, created.id)

      expect(result).toBe(true)

      // 削除されていることを確認
      const deleted = await getItemById(env.DB, created.id)
      expect(deleted).toBeNull()
    })

    it('存在しないIDの場合はfalseを返す', async () => {
      const result = await deleteItem(env.DB, 99999)

      expect(result).toBe(false)
    })
  })
})
