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
    <section class="mb-10">
      {/* Category Header */}
      <div class="flex items-center mb-4 pb-2 border-b border-gray-200">
        <i class={`fa-solid ${iconClass} text-accent text-xl mr-3`}></i>
        <h2 class="text-xl font-bold text-primary">{label}</h2>
        <span class="ml-2 text-sm text-secondary">({items.length})</span>
      </div>

      {/* Items Grid */}
      {items.length > 0 ? (
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div class="text-center py-8 text-secondary">
          <i class={`fa-solid ${iconClass} text-4xl mb-2 opacity-30`}></i>
          <p>まだアイテムがありません</p>
        </div>
      )}
    </section>
  )
}
