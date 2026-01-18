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
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div class="mb-10 md:mb-14">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <i class="fa-solid fa-vest text-accent text-xl" aria-hidden="true"></i>
                </div>
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-primary tracking-wide">
                  ワードローブ
                </h1>
              </div>
              <p class="text-secondary text-sm md:text-base">
                あなたのアイテムを一覧で管理
                <span class="ml-3 px-3 py-1 bg-accent/10 text-accent font-medium rounded-full text-sm">
                  {totalItems}点
                </span>
              </p>
            </div>
            <div>
              <Button variant="accent" size="lg" href="/items/new">
                <i class="fa-solid fa-plus" aria-hidden="true"></i>
                アイテムを追加
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div class="mb-8 p-5 bg-accent/5 border border-accent/20 rounded-2xl text-accent-dark">
            <i class="fa-solid fa-exclamation-triangle mr-2" aria-hidden="true"></i>
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && totalItems === 0 && (
          <div class="text-center py-20 bg-background/50 rounded-2xl border border-border-light">
            <i class="fa-solid fa-shirt text-7xl text-secondary/20 mb-6" aria-hidden="true"></i>
            <h2 class="text-xl md:text-2xl font-bold text-primary mb-3 tracking-wide">
              アイテムがありません
            </h2>
            <p class="text-secondary mb-8 text-sm md:text-base">
              最初のアイテムを追加して、ワードローブの管理を始めましょう
            </p>
            <Button variant="accent" size="lg" href="/items/new">
              <i class="fa-solid fa-plus" aria-hidden="true"></i>
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
