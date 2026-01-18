import type { Item, Category } from '../../types/item'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../../lib/constants'
import { ItemCard } from './ItemCard'

interface CategorySectionProps {
  category: Category
  items: Item[]
}

export function CategorySection({ category, items }: CategorySectionProps) {
  const iconClass = CATEGORY_ICONS[category]
  const label = CATEGORY_LABELS[category]

  return (
    <section class="mb-12">
      {/* Category Header */}
      <div class="flex items-center mb-6 pb-3 border-b-2 border-accent/20">
        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 mr-4">
          <i class={`fa-solid ${iconClass} text-accent text-xl`} aria-hidden="true"></i>
        </div>
        <div class="flex items-baseline">
          <h2 class="text-xl md:text-2xl font-bold text-primary tracking-wide">{label}</h2>
          <span class="ml-3 px-2.5 py-0.5 text-sm font-medium text-secondary bg-background rounded-full">
            {items.length}
          </span>
        </div>
      </div>

      {/* Items Grid */}
      {items.length > 0 ? (
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div class="text-center py-12 bg-background/50 rounded-2xl border border-border-light">
          <i class={`fa-solid ${iconClass} text-5xl mb-3 text-secondary/30`} aria-hidden="true"></i>
          <p class="text-secondary text-sm">まだアイテムがありません</p>
          <p class="text-secondary-light text-xs mt-1">「新規追加」からアイテムを追加しましょう</p>
        </div>
      )}
    </section>
  )
}
