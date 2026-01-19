import { createRoute } from 'honox/factory'
import { Layout } from '../../../components/layout/Layout'
import { Button } from '../../../components/ui/Button'
import { ItemForm } from '../../../components/items/ItemForm'
import { GetItem, UpdateItem, type CategoryValue, type UpdateItemError, type ItemReadModel } from '../../../src/item'
import { D1ItemRepository } from '../../../infrastructure/d1/item-repository-impl'
import { D1ItemReadRepository } from '../../../infrastructure/d1/item-read-repository-impl'

interface FormErrors {
  name?: string
  category?: string
  color?: string
  brand?: string
  description?: string
  general?: string
}

/**
 * ItemReadModelからフォーム用のアイテム形式に変換
 */
function toFormItem(readModel: ItemReadModel) {
  return {
    id: readModel.id,
    name: readModel.name,
    category: readModel.category,
    color: readModel.color,
    brand: readModel.brand,
    description: readModel.description,
    created_at: readModel.createdAt,
    updated_at: readModel.updatedAt,
  }
}

/**
 * UpdateItemErrorをフォームエラーに変換
 */
function mapUpdateItemErrorToFormErrors(error: UpdateItemError): FormErrors {
  switch (error.type) {
    case 'INVALID_ITEM_NAME':
      return { name: error.message }
    case 'INVALID_CATEGORY':
      return { category: error.message }
    case 'INVALID_COLOR':
      return { color: error.message }
    case 'ITEM_NOT_FOUND':
      return { general: 'アイテムが見つかりませんでした' }
    case 'DATABASE_ERROR':
      return { general: 'アイテムの更新に失敗しました。もう一度お試しください。' }
    default:
      return { general: 'エラーが発生しました。もう一度お試しください。' }
  }
}

// GET: 編集フォーム表示
export default createRoute(async (c) => {
  const db = c.env.DB
  const idParam = c.req.param('id') ?? ''
  const id = parseInt(idParam, 10)

  // リポジトリとユースケースのインスタンス化
  const itemReadRepository = new D1ItemReadRepository(db)
  const getItem = new GetItem(itemReadRepository)

  // ユースケースを実行してアイテムを取得
  const result = await getItem.execute(id)

  if (result.isErr()) {
    const error = result.error

    // IDバリデーションエラー
    if (error.type === 'INVALID_ITEM_ID') {
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

    // アイテムが見つからない、またはその他のエラー
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

  const item = toFormItem(result.value)

  return c.render(
    <Layout>
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div class="mb-8 md:mb-10">
          <nav class="text-sm text-secondary mb-4">
            <a href="/" class="hover:text-accent transition-colors duration-250">ホーム</a>
            <span class="mx-2 text-border">/</span>
            <a href={`/items/${id}`} class="hover:text-accent transition-colors duration-250">
              {item.name}
            </a>
            <span class="mx-2 text-border">/</span>
            <span class="text-primary font-medium">編集</span>
          </nav>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <i class="fa-solid fa-edit text-accent text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-primary tracking-wide">
                アイテムを編集
              </h1>
              <p class="text-secondary text-sm mt-1">
                アイテム情報を変更します
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div class="max-w-2xl">
          <div class="bg-card-bg rounded-2xl shadow-card border border-border-light p-6 md:p-8">
            <ItemForm
              item={item}
              action={`/items/${id}/edit`}
              method="POST"
              cancelUrl={`/items/${id}`}
              submitLabel="更新"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
})

// POST: 更新処理
export const POST = createRoute(async (c) => {
  const db = c.env.DB
  const idParam = c.req.param('id') ?? ''
  const id = parseInt(idParam, 10)

  const body = await c.req.parseBody()
  let errors: FormErrors = {}

  // フォームデータを取得
  const formData = {
    id,
    name: (body.name as string) ?? '',
    category: (body.category as CategoryValue) ?? 'tops',
    color: (body.color as string) ?? '',
    brand: (body.brand as string) || null,
    description: (body.description as string) || null,
  }

  // リポジトリとユースケースのインスタンス化
  const itemRepository = new D1ItemRepository(db)
  const itemReadRepository = new D1ItemReadRepository(db)
  const updateItem = new UpdateItem(itemRepository, itemReadRepository)
  const getItem = new GetItem(itemReadRepository)

  // ユースケースを実行
  const result = await updateItem.execute({
    id: formData.id,
    name: formData.name,
    category: formData.category,
    color: formData.color,
    brand: formData.brand,
    description: formData.description,
  })

  if (result.isOk()) {
    // 成功したら詳細ページにリダイレクト
    return c.redirect(`/items/${id}`, 302)
  }

  // エラー時はフォームエラーに変換
  errors = mapUpdateItemErrorToFormErrors(result.error)
  console.error('Failed to update item:', result.error)

  // INVALID_ITEM_IDの場合はホームにリダイレクト
  if (result.error.type === 'INVALID_ITEM_ID') {
    return c.redirect('/', 302)
  }

  // エラー時はフォームを再表示
  const existingItemResult = await getItem.execute(id)

  if (existingItemResult.isErr()) {
    return c.redirect('/', 302)
  }

  const existingItem = toFormItem(existingItemResult.value)

  // フォームに表示するデータ（エラー時は送信データを保持）
  const displayItem = {
    id: existingItem.id,
    name: formData.name ?? existingItem.name,
    category: formData.category ?? existingItem.category,
    color: formData.color ?? existingItem.color,
    brand: formData.brand !== undefined ? formData.brand : existingItem.brand,
    description: formData.description !== undefined ? formData.description : existingItem.description,
    created_at: existingItem.created_at,
    updated_at: existingItem.updated_at,
  }

  return c.render(
    <Layout>
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div class="mb-8 md:mb-10">
          <nav class="text-sm text-secondary mb-4">
            <a href="/" class="hover:text-accent transition-colors duration-250">ホーム</a>
            <span class="mx-2 text-border">/</span>
            <a href={`/items/${id}`} class="hover:text-accent transition-colors duration-250">
              {existingItem.name}
            </a>
            <span class="mx-2 text-border">/</span>
            <span class="text-primary font-medium">編集</span>
          </nav>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <i class="fa-solid fa-edit text-accent text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-primary tracking-wide">
                アイテムを編集
              </h1>
              <p class="text-secondary text-sm mt-1">
                アイテム情報を変更します
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div class="max-w-2xl">
          <div class="bg-card-bg rounded-2xl shadow-card border border-border-light p-6 md:p-8">
            <ItemForm
              item={displayItem}
              action={`/items/${id}/edit`}
              method="POST"
              cancelUrl={`/items/${id}`}
              submitLabel="更新"
              errors={errors}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
})
