import { createRoute } from 'honox/factory'
import { Layout } from '../../components/layout/Layout'
import { ItemForm } from '../../components/items/ItemForm'
import { CreateItem, type CategoryValue, type CreateItemError } from '../../src/item'
import { D1ItemRepository } from '../../infrastructure/d1/item-repository-impl'
import { D1ItemReadRepository } from '../../infrastructure/d1/item-read-repository-impl'

interface FormErrors {
  name?: string
  category?: string
  color?: string
  brand?: string
  description?: string
  general?: string
}

/**
 * CreateItemErrorをフォームエラーに変換
 */
function mapCreateItemErrorToFormErrors(error: CreateItemError): FormErrors {
  switch (error.type) {
    case 'INVALID_ITEM_NAME':
      return { name: error.message }
    case 'INVALID_CATEGORY':
      return { category: error.message }
    case 'INVALID_COLOR':
      return { color: error.message }
    case 'DATABASE_ERROR':
      return { general: 'アイテムの作成に失敗しました。もう一度お試しください。' }
    default:
      return { general: 'エラーが発生しました。もう一度お試しください。' }
  }
}

// GET: フォーム表示
export default createRoute((c) => {
  return c.render(
    <Layout>
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div class="mb-8 md:mb-10">
          <nav class="text-sm text-secondary mb-4">
            <a href="/" class="hover:text-accent transition-colors duration-250">ホーム</a>
            <span class="mx-2 text-border">/</span>
            <span class="text-primary font-medium">新規追加</span>
          </nav>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <i class="fa-solid fa-plus text-accent text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-primary tracking-wide">
                アイテムを追加
              </h1>
              <p class="text-secondary text-sm mt-1">
                新しいアイテムをワードローブに追加します
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div class="max-w-2xl">
          <div class="bg-card-bg rounded-2xl shadow-card border border-border-light p-6 md:p-8">
            <ItemForm
              action="/items/new"
              method="POST"
              cancelUrl="/"
              submitLabel="追加"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
})

// POST: フォーム送信処理
export const POST = createRoute(async (c) => {
  const db = c.env.DB
  const body = await c.req.parseBody()
  let errors: FormErrors = {}

  // フォームデータを取得
  const formData = {
    name: (body.name as string) ?? '',
    category: (body.category as string) ?? '',
    color: (body.color as string) ?? '',
    brand: (body.brand as string) ?? '',
    description: (body.description as string) ?? '',
  }

  // リポジトリとユースケースのインスタンス化
  const itemRepository = new D1ItemRepository(db)
  const itemReadRepository = new D1ItemReadRepository(db)
  const createItem = new CreateItem(itemRepository, itemReadRepository)

  // ユースケースを実行
  const result = await createItem.execute({
    name: formData.name,
    category: formData.category,
    color: formData.color,
    brand: formData.brand || null,
    description: formData.description || null,
  })

  if (result.isOk()) {
    // 成功したら一覧にリダイレクト
    return c.redirect('/', 302)
  }

  // エラー時はフォームエラーに変換
  errors = mapCreateItemErrorToFormErrors(result.error)
  console.error('Failed to create item:', result.error)

  // エラー時はフォームを再表示
  return c.render(
    <Layout>
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div class="mb-8 md:mb-10">
          <nav class="text-sm text-secondary mb-4">
            <a href="/" class="hover:text-accent transition-colors duration-250">ホーム</a>
            <span class="mx-2 text-border">/</span>
            <span class="text-primary font-medium">新規追加</span>
          </nav>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <i class="fa-solid fa-plus text-accent text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-primary tracking-wide">
                アイテムを追加
              </h1>
              <p class="text-secondary text-sm mt-1">
                新しいアイテムをワードローブに追加します
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div class="max-w-2xl">
          <div class="bg-card-bg rounded-2xl shadow-card border border-border-light p-6 md:p-8">
            <ItemForm
              action="/items/new"
              method="POST"
              cancelUrl="/"
              submitLabel="追加"
              errors={errors}
              item={formData.name ? {
                id: 0,
                name: formData.name,
                category: formData.category as CategoryValue,
                color: formData.color,
                brand: formData.brand || null,
                description: formData.description || null,
                created_at: '',
                updated_at: '',
              } : undefined}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
})
