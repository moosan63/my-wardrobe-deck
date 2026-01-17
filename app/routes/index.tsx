import { createRoute } from 'honox/factory'
import { getAllItems } from '../db/items'
import { CATEGORIES } from '../lib/constants'
import type { Item, Category } from '../types/item'
import { Layout } from '../components/layout/Layout'
import { CategorySection } from '../components/items/CategorySection'
import { Button } from '../components/ui/Button'

export default createRoute(async (c) => {
  const db = c.env.DB
  let items: Item[] = []
  let error: string | null = null

  try {
    items = await getAllItems(db)
  } catch (e) {
    error = 'アイテムの取得に失敗しました'
    console.error('Failed to fetch items:', e)
  }

  // カテゴリごとにグループ化
  const itemsByCategory: Record<Category, Item[]> = {
    outer: [],
    tops: [],
    bottoms: [],
    shoes: [],
    accessories: [],
  }

  for (const item of items) {
    if (itemsByCategory[item.category]) {
      itemsByCategory[item.category].push(item)
    }
  }

  const totalItems = items.length

  return c.render(
    <Layout>
      <div class="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div class="mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-primary mb-2">
                ワードローブ
              </h1>
              <p class="text-secondary">
                あなたのアイテムを一覧で管理
                <span class="ml-2 text-accent font-medium">
                  {totalItems}点
                </span>
              </p>
            </div>
            <div class="mt-4 md:mt-0">
              <Button variant="accent" size="lg" href="/items/new">
                <i class="fa-solid fa-plus mr-2"></i>
                アイテムを追加
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <i class="fa-solid fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && totalItems === 0 && (
          <div class="text-center py-16">
            <i class="fa-solid fa-shirt text-6xl text-secondary/30 mb-4"></i>
            <h2 class="text-xl font-medium text-primary mb-2">
              アイテムがありません
            </h2>
            <p class="text-secondary mb-6">
              最初のアイテムを追加して、ワードローブの管理を始めましょう
            </p>
            <Button variant="accent" href="/items/new">
              <i class="fa-solid fa-plus mr-2"></i>
              最初のアイテムを追加
            </Button>
          </div>
        )}

        {/* Category Sections */}
        {!error && totalItems > 0 && (
          <div>
            {CATEGORIES.map((category) => (
              <CategorySection
                key={category}
                category={category}
                items={itemsByCategory[category]}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
})
