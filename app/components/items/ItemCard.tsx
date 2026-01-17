import type { Item } from '../../types/item'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../../lib/constants'
import { Card } from '../ui/Card'

interface ItemCardProps {
  item: Item
}

/**
 * 色名からTailwindのbg-*クラスを生成
 * 基本的な色名に対応。不明な色はグレー背景を使用
 */
function getColorStyle(color: string): string {
  // CSSカラー名またはHEXコードの場合はインラインスタイルで対応
  // Tailwindで対応できる基本色のマッピング
  const colorMap: Record<string, string> = {
    // 日本語色名
    '黒': '#1a1a1a',
    '白': '#f5f5f5',
    '赤': '#dc2626',
    '青': '#2563eb',
    '緑': '#16a34a',
    '黄': '#ca8a04',
    '紫': '#9333ea',
    'ピンク': '#ec4899',
    'オレンジ': '#ea580c',
    '茶': '#92400e',
    'グレー': '#6b7280',
    'ネイビー': '#1e3a5f',
    'ベージュ': '#d4c4a8',
    'カーキ': '#6b7357',
    // 英語色名
    'black': '#1a1a1a',
    'white': '#f5f5f5',
    'red': '#dc2626',
    'blue': '#2563eb',
    'green': '#16a34a',
    'yellow': '#ca8a04',
    'purple': '#9333ea',
    'pink': '#ec4899',
    'orange': '#ea580c',
    'brown': '#92400e',
    'gray': '#6b7280',
    'grey': '#6b7280',
    'navy': '#1e3a5f',
    'beige': '#d4c4a8',
    'khaki': '#6b7357',
  }

  const normalizedColor = color.toLowerCase().trim()

  // マッピングにある色名
  if (colorMap[normalizedColor]) {
    return colorMap[normalizedColor]
  }

  // HEXコードの場合（検証付き）
  if (normalizedColor.startsWith('#') && /^#[0-9a-f]{3,6}$/i.test(normalizedColor)) {
    return normalizedColor
  }

  // その他はデフォルトグレー
  return '#9ca3af'
}

/**
 * 背景色に応じたテキスト色を決定（コントラスト確保）
 */
function getTextColorForBg(bgColor: string): string {
  // 簡易的な明度判定（HEXの場合）
  if (bgColor.startsWith('#')) {
    const hex = bgColor.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#1a202c' : '#ffffff'
  }
  return '#ffffff'
}

export function ItemCard({ item }: ItemCardProps) {
  const bgColor = getColorStyle(item.color)
  const textColor = getTextColorForBg(bgColor)
  const iconClass = CATEGORY_ICONS[item.category]

  return (
    <Card href={`/items/${item.id}`} class="group">
      {/* Color Background with Icon */}
      <div
        class="aspect-square flex items-center justify-center relative overflow-hidden"
        style={`background-color: ${bgColor}`}
      >
        <i
          class={`fa-solid ${iconClass} text-5xl md:text-6xl opacity-30 group-hover:opacity-40 transition-opacity`}
          style={`color: ${textColor}`}
          aria-hidden="true"
        ></i>

        {/* Category Badge */}
        <span class="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded bg-white/90 text-primary">
          {CATEGORY_LABELS[item.category]}
        </span>
      </div>

      {/* Item Info */}
      <div class="p-3">
        <h3 class="font-medium text-text-main truncate group-hover:text-accent transition-colors">
          {item.name}
        </h3>
        <div class="mt-1 flex items-center justify-between text-sm text-secondary">
          <span class="flex items-center">
            <span
              class="w-3 h-3 rounded-full mr-1.5 border border-gray-200"
              style={`background-color: ${bgColor}`}
            ></span>
            {item.color}
          </span>
          {item.brand && (
            <span class="truncate ml-2 text-xs">{item.brand}</span>
          )}
        </div>
      </div>
    </Card>
  )
}
