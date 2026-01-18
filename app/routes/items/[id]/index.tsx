import { createRoute } from 'honox/factory'
import { Layout } from '../../../components/layout/Layout'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { getItemById, deleteItem } from '../../../db/items'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../../../lib/constants'

/**
 * 色名からHEXカラーコードを取得
 */
function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
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
  }
  return colorMap[color] || '#9ca3af'
}

/**
 * 背景色に応じたテキスト色を決定
 */
function getTextColor(bgColor: string): string {
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

// GET: アイテム詳細表示
export default createRoute(async (c) => {
  const db = c.env.DB
  const idParam = c.req.param('id') ?? ''
  const id = parseInt(idParam, 10)

  // IDバリデーション
  if (isNaN(id) || id <= 0) {
    return c.render(
      <Layout>
        <div class="container mx-auto px-4 py-8">
          <div class="text-center py-16">
            <i class="fa-solid fa-exclamation-triangle text-6xl text-red-500/50 mb-4"></i>
            <h2 class="text-xl font-medium text-primary mb-2">
              無効なIDです
            </h2>
            <p class="text-secondary mb-6">
              指定されたIDは有効ではありません
            </p>
            <Button variant="primary" href="/">
              <i class="fa-solid fa-home mr-2"></i>
              ホームに戻る
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  // アイテム取得
  const item = await getItemById(db, id)

  if (!item) {
    return c.render(
      <Layout>
        <div class="container mx-auto px-4 py-8">
          <div class="text-center py-16">
            <i class="fa-solid fa-search text-6xl text-secondary/30 mb-4"></i>
            <h2 class="text-xl font-medium text-primary mb-2">
              アイテムが見つかりません
            </h2>
            <p class="text-secondary mb-6">
              指定されたアイテムは存在しないか、削除された可能性があります
            </p>
            <Button variant="primary" href="/">
              <i class="fa-solid fa-home mr-2"></i>
              ホームに戻る
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  const bgColor = getColorHex(item.color)
  const textColor = getTextColor(bgColor)
  const iconClass = CATEGORY_ICONS[item.category]

  return c.render(
    <Layout>
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav class="text-sm text-secondary mb-6">
          <a href="/" class="hover:text-accent transition-colors duration-250">ホーム</a>
          <span class="mx-2 text-border">/</span>
          <span class="text-primary font-medium">{item.name}</span>
        </nav>

        <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Color Display Card */}
          <Card class="overflow-hidden">
            <div
              class="aspect-square flex items-center justify-center relative"
              style={`background-color: ${bgColor}`}
            >
              <i
                class={`fa-solid ${iconClass} text-8xl md:text-9xl opacity-20`}
                style={`color: ${textColor}`}
                aria-hidden="true"
              ></i>
              <span class="absolute top-4 left-4 px-4 py-2 text-sm font-medium rounded-xl bg-white/95 text-primary shadow-sm backdrop-blur-sm">
                {CATEGORY_LABELS[item.category]}
              </span>
            </div>
          </Card>

          {/* Item Details */}
          <div>
            <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-6 tracking-wide">
              {item.name}
            </h1>

            <div class="space-y-5 mb-10">
              {/* Category */}
              <div class="flex items-center py-3 border-b border-border-light">
                <span class="w-28 text-secondary text-sm">カテゴリ</span>
                <span class="flex items-center text-primary font-medium">
                  <i class={`fa-solid ${iconClass} mr-2 text-accent`} aria-hidden="true"></i>
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>

              {/* Color */}
              <div class="flex items-center py-3 border-b border-border-light">
                <span class="w-28 text-secondary text-sm">色</span>
                <span class="flex items-center text-primary font-medium">
                  <span
                    class="w-5 h-5 rounded-full mr-2 border border-border shadow-sm"
                    style={`background-color: ${bgColor}`}
                  ></span>
                  {item.color}
                </span>
              </div>

              {/* Brand */}
              {item.brand && (
                <div class="flex items-center py-3 border-b border-border-light">
                  <span class="w-28 text-secondary text-sm">ブランド</span>
                  <span class="text-primary font-medium">{item.brand}</span>
                </div>
              )}

              {/* Description */}
              {item.description && (
                <div class="py-3">
                  <span class="block text-secondary text-sm mb-2">説明・メモ</span>
                  <p class="text-primary bg-background rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div class="pt-4 text-sm text-secondary-light">
                <div class="flex items-center mb-2">
                  <i class="fa-solid fa-clock mr-2 w-4 text-center" aria-hidden="true"></i>
                  作成: {new Date(item.created_at).toLocaleDateString('ja-JP')}
                </div>
                <div class="flex items-center">
                  <i class="fa-solid fa-pen mr-2 w-4 text-center" aria-hidden="true"></i>
                  更新: {new Date(item.updated_at).toLocaleDateString('ja-JP')}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div class="flex flex-wrap gap-3">
              <Button variant="ghost" href="/">
                <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                一覧に戻る
              </Button>
              <Button variant="primary" href={`/items/${item.id}/edit`}>
                <i class="fa-solid fa-edit" aria-hidden="true"></i>
                編集
              </Button>
              {/* Delete Form */}
              <form
                action={`/items/${item.id}/delete`}
                method="post"
                class="inline-block"
                onsubmit="return confirm('本当に削除しますか？この操作は取り消せません。')"
              >
                <Button type="submit" variant="danger">
                  <i class="fa-solid fa-trash" aria-hidden="true"></i>
                  削除
                </Button>
              </form>
            </div>

            {/* Delete Confirmation Note */}
            <p class="mt-4 text-xs text-secondary-light">
              <i class="fa-solid fa-info-circle mr-1" aria-hidden="true"></i>
              削除すると元に戻すことはできません
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
})
