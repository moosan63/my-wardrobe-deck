import { describe, it, expect, beforeEach } from 'vitest'
import { env } from 'cloudflare:test'
import { Hono } from 'hono'
import {
  getItemsHandler,
  postItemsHandler,
  getItemHandler,
  putItemHandler,
  deleteItemHandler,
} from '../../app/lib/items-handlers'

// テスト用にHonoアプリを構築
const app = new Hono<{ Bindings: { DB: D1Database } }>()
app.get('/api/items', getItemsHandler)
app.post('/api/items', postItemsHandler)
app.get('/api/items/:id', getItemHandler)
app.put('/api/items/:id', putItemHandler)
app.delete('/api/items/:id', deleteItemHandler)

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

// テスト用にアイテムを作成するヘルパー
async function createTestItem(db: D1Database, overrides = {}) {
  const defaults = {
    name: 'テストアイテム',
    category: 'tops',
    color: '白',
    brand: null,
    description: null,
  }
  const data = { ...defaults, ...overrides }
  const result = await db
    .prepare(
      `INSERT INTO items (name, category, color, brand, description)
       VALUES (?, ?, ?, ?, ?)
       RETURNING *`
    )
    .bind(data.name, data.category, data.color, data.brand, data.description)
    .first()
  return result
}

describe('Items API', () => {
  beforeEach(async () => {
    await setupSchema(env.DB)
    await clearItems(env.DB)
  })

  describe('GET /api/items', () => {
    it('全アイテムを取得できる', async () => {
      await createTestItem(env.DB, { name: 'アイテム1', category: 'outer' })
      await createTestItem(env.DB, { name: 'アイテム2', category: 'tops' })

      const res = await app.request('/api/items', {}, env)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data).toHaveLength(2)
    })

    it('アイテムがない場合は空配列を返す', async () => {
      const res = await app.request('/api/items', {}, env)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data).toEqual([])
    })

    it('categoryクエリパラメータでフィルタリングできる', async () => {
      await createTestItem(env.DB, { name: 'アウター1', category: 'outer' })
      await createTestItem(env.DB, { name: 'トップス1', category: 'tops' })
      await createTestItem(env.DB, { name: 'アウター2', category: 'outer' })

      const res = await app.request('/api/items?category=outer', {}, env)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data).toHaveLength(2)
      expect(json.data.every((item: { category: string }) => item.category === 'outer')).toBe(true)
    })

    it('無効なcategoryの場合は400エラーを返す', async () => {
      const res = await app.request('/api/items?category=invalid', {}, env)
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.error).toBeDefined()
      expect(json.error.message).toContain('category')
    })
  })

  describe('POST /api/items', () => {
    it('新しいアイテムを作成できる', async () => {
      const newItem = {
        name: '新しいジャケット',
        category: 'outer',
        color: 'ネイビー',
        brand: 'Test Brand',
        description: 'テスト説明',
      }

      const res = await app.request(
        '/api/items',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data.name).toBe('新しいジャケット')
      expect(json.data.category).toBe('outer')
      expect(json.data.color).toBe('ネイビー')
      expect(json.data.brand).toBe('Test Brand')
      expect(json.data.description).toBe('テスト説明')
      expect(json.data.id).toBeDefined()
    })

    it('必須フィールドのみでアイテムを作成できる', async () => {
      const newItem = {
        name: 'シンプルTシャツ',
        category: 'tops',
        color: '白',
      }

      const res = await app.request(
        '/api/items',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data.name).toBe('シンプルTシャツ')
      expect(json.data.brand).toBeNull()
      expect(json.data.description).toBeNull()
    })

    it('nameが空の場合は400エラーを返す', async () => {
      const newItem = {
        name: '',
        category: 'tops',
        color: '白',
      }

      const res = await app.request(
        '/api/items',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.error.message).toContain('name')
    })

    it('nameがない場合は400エラーを返す', async () => {
      const newItem = {
        category: 'tops',
        color: '白',
      }

      const res = await app.request(
        '/api/items',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
    })

    it('categoryが無効な場合は400エラーを返す', async () => {
      const newItem = {
        name: 'テスト',
        category: 'invalid_category',
        color: '白',
      }

      const res = await app.request(
        '/api/items',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.error.message).toContain('category')
    })

    it('colorがない場合は400エラーを返す', async () => {
      const newItem = {
        name: 'テスト',
        category: 'tops',
      }

      const res = await app.request(
        '/api/items',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
    })

    it('不正なJSONの場合は400エラーを返す', async () => {
      const res = await app.request(
        '/api/items',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json',
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.error.message).toContain('Invalid JSON')
    })
  })

  describe('GET /api/items/:id', () => {
    it('IDでアイテムを取得できる', async () => {
      const item = await createTestItem(env.DB, { name: 'テストアイテム', category: 'shoes' })

      const res = await app.request(`/api/items/${item!.id}`, {}, env)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.id).toBe(item!.id)
      expect(json.data.name).toBe('テストアイテム')
    })

    it('存在しないIDの場合は404エラーを返す', async () => {
      const res = await app.request('/api/items/99999', {}, env)
      const json = await res.json()

      expect(res.status).toBe(404)
      expect(json.success).toBe(false)
      expect(json.error.message).toContain('not found')
    })

    it('無効なIDの場合は400エラーを返す', async () => {
      const res = await app.request('/api/items/invalid', {}, env)
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
    })
  })

  describe('PUT /api/items/:id', () => {
    it('アイテムを更新できる', async () => {
      const item = await createTestItem(env.DB, { name: '元の名前', category: 'tops' })

      const updateData = {
        name: '更新後の名前',
        color: '黒',
      }

      const res = await app.request(
        `/api/items/${item!.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.name).toBe('更新後の名前')
      expect(json.data.color).toBe('黒')
      expect(json.data.category).toBe('tops') // 未更新フィールドは維持
    })

    it('存在しないIDの場合は404エラーを返す', async () => {
      const res = await app.request(
        '/api/items/99999',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: '更新' }),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(404)
      expect(json.success).toBe(false)
      expect(json.error.message).toContain('not found')
    })

    it('無効なcategoryで更新しようとすると400エラーを返す', async () => {
      const item = await createTestItem(env.DB, { name: 'テスト', category: 'tops' })

      const res = await app.request(
        `/api/items/${item!.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'invalid_category' }),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.error.message).toContain('category')
    })

    it('nameを空文字で更新しようとすると400エラーを返す', async () => {
      const item = await createTestItem(env.DB, { name: 'テスト', category: 'tops' })

      const res = await app.request(
        `/api/items/${item!.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: '' }),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
    })

    it('無効なIDの場合は400エラーを返す', async () => {
      const res = await app.request(
        '/api/items/invalid',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: '更新' }),
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
    })

    it('不正なJSONの場合は400エラーを返す', async () => {
      const item = await createTestItem(env.DB, { name: 'テスト', category: 'tops' })

      const res = await app.request(
        `/api/items/${item!.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json',
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.error.message).toContain('Invalid JSON')
    })
  })

  describe('DELETE /api/items/:id', () => {
    it('アイテムを削除できる', async () => {
      const item = await createTestItem(env.DB, { name: '削除対象', category: 'bottoms' })

      const res = await app.request(
        `/api/items/${item!.id}`,
        {
          method: 'DELETE',
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)

      // 削除されていることを確認
      const checkRes = await app.request(`/api/items/${item!.id}`, {}, env)
      expect(checkRes.status).toBe(404)
    })

    it('存在しないIDの場合は404エラーを返す', async () => {
      const res = await app.request(
        '/api/items/99999',
        {
          method: 'DELETE',
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(404)
      expect(json.success).toBe(false)
      expect(json.error.message).toContain('not found')
    })

    it('無効なIDの場合は400エラーを返す', async () => {
      const res = await app.request(
        '/api/items/invalid',
        {
          method: 'DELETE',
        },
        env
      )
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
    })
  })
})
