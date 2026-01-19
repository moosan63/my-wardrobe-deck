/**
 * D1ItemReadRepository 統合テスト
 * Read側リポジトリの実装を検証
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { env } from 'cloudflare:test'
import { D1ItemReadRepository } from '../../../app/infrastructure/d1/item-read-repository-impl'
import { D1ItemRepository } from '../../../app/infrastructure/d1/item-repository-impl'
import { Item } from '../../../app/src/item/domain'

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

// テストアイテムを作成するヘルパー関数
async function createTestItem(
  writeRepo: D1ItemRepository,
  params: {
    name: string
    category: string
    color: string
    brand?: string | null
    description?: string | null
  }
): Promise<Item> {
  const itemResult = Item.create(params)
  if (itemResult.isErr()) {
    throw new Error(`Failed to create item: ${JSON.stringify(itemResult.error)}`)
  }
  const saveResult = await writeRepo.save(itemResult.value)
  if (saveResult.isErr()) {
    throw new Error(`Failed to save item: ${JSON.stringify(saveResult.error)}`)
  }
  return saveResult.value
}

describe('D1ItemReadRepository', () => {
  let readRepository: D1ItemReadRepository
  let writeRepository: D1ItemRepository

  beforeEach(async () => {
    await setupSchema(env.DB)
    await clearItems(env.DB)
    readRepository = new D1ItemReadRepository(env.DB)
    writeRepository = new D1ItemRepository(env.DB)
  })

  describe('findById', () => {
    it('IDでアイテム詳細を取得できる', async () => {
      const item = await createTestItem(writeRepository, {
        name: 'テストシューズ',
        category: 'shoes',
        color: '茶',
        brand: 'Shoe Brand',
        description: 'テスト説明',
      })

      const result = await readRepository.findById(item.id.value)

      expect(result.isOk()).toBe(true)
      const readModel = result._unsafeUnwrap()
      expect(readModel).not.toBeNull()
      expect(readModel!.id).toBe(item.id.value)
      expect(readModel!.name).toBe('テストシューズ')
      expect(readModel!.category).toBe('shoes')
      expect(readModel!.color).toBe('茶')
      expect(readModel!.brand).toBe('Shoe Brand')
      expect(readModel!.description).toBe('テスト説明')
      expect(readModel!.createdAt).toBeDefined()
      expect(readModel!.updatedAt).toBeDefined()
    })

    it('存在しないIDの場合はnullを返す', async () => {
      const result = await readRepository.findById(99999)

      expect(result.isOk()).toBe(true)
      const readModel = result._unsafeUnwrap()
      expect(readModel).toBeNull()
    })
  })

  describe('findAll', () => {
    it('全アイテムを取得できる（作成日時降順）', async () => {
      await createTestItem(writeRepository, {
        name: 'アイテム1',
        category: 'outer',
        color: '黒',
      })
      await createTestItem(writeRepository, {
        name: 'アイテム2',
        category: 'tops',
        color: '白',
      })
      await createTestItem(writeRepository, {
        name: 'アイテム3',
        category: 'bottoms',
        color: '青',
      })

      const result = await readRepository.findAll()

      expect(result.isOk()).toBe(true)
      const items = result._unsafeUnwrap()
      expect(items).toHaveLength(3)
      // ItemListReadModelのフィールドを確認
      expect(items[0]).toHaveProperty('id')
      expect(items[0]).toHaveProperty('name')
      expect(items[0]).toHaveProperty('category')
      expect(items[0]).toHaveProperty('color')
      expect(items[0]).toHaveProperty('brand')
      // createdAt, updatedAt, descriptionはリスト用モデルには含まない
      expect(items[0]).not.toHaveProperty('createdAt')
      expect(items[0]).not.toHaveProperty('updatedAt')
      expect(items[0]).not.toHaveProperty('description')
    })

    it('アイテムがない場合は空配列を返す', async () => {
      const result = await readRepository.findAll()

      expect(result.isOk()).toBe(true)
      const items = result._unsafeUnwrap()
      expect(items).toEqual([])
    })
  })

  describe('findByCategory', () => {
    it('カテゴリでアイテムをフィルタリングできる', async () => {
      await createTestItem(writeRepository, {
        name: 'アウター1',
        category: 'outer',
        color: '黒',
      })
      await createTestItem(writeRepository, {
        name: 'トップス1',
        category: 'tops',
        color: '白',
      })
      await createTestItem(writeRepository, {
        name: 'アウター2',
        category: 'outer',
        color: '紺',
      })

      const result = await readRepository.findByCategory('outer')

      expect(result.isOk()).toBe(true)
      const items = result._unsafeUnwrap()
      expect(items).toHaveLength(2)
      expect(items.every((item) => item.category === 'outer')).toBe(true)
    })

    it('該当カテゴリがない場合は空配列を返す', async () => {
      await createTestItem(writeRepository, {
        name: 'トップス1',
        category: 'tops',
        color: '白',
      })

      const result = await readRepository.findByCategory('accessories')

      expect(result.isOk()).toBe(true)
      const items = result._unsafeUnwrap()
      expect(items).toEqual([])
    })

    it('全てのカテゴリで検索できる', async () => {
      await createTestItem(writeRepository, { name: 'アウター', category: 'outer', color: '黒' })
      await createTestItem(writeRepository, { name: 'トップス', category: 'tops', color: '白' })
      await createTestItem(writeRepository, { name: 'ボトムス', category: 'bottoms', color: '青' })
      await createTestItem(writeRepository, { name: 'シューズ', category: 'shoes', color: '茶' })
      await createTestItem(writeRepository, { name: 'アクセ', category: 'accessories', color: '銀' })

      const outerResult = await readRepository.findByCategory('outer')
      const topsResult = await readRepository.findByCategory('tops')
      const bottomsResult = await readRepository.findByCategory('bottoms')
      const shoesResult = await readRepository.findByCategory('shoes')
      const accessoriesResult = await readRepository.findByCategory('accessories')

      expect(outerResult.isOk() && outerResult.value.length).toBe(1)
      expect(topsResult.isOk() && topsResult.value.length).toBe(1)
      expect(bottomsResult.isOk() && bottomsResult.value.length).toBe(1)
      expect(shoesResult.isOk() && shoesResult.value.length).toBe(1)
      expect(accessoriesResult.isOk() && accessoriesResult.value.length).toBe(1)
    })
  })
})
