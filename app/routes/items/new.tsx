import { createRoute } from 'honox/factory'
import { Layout } from '../../components/layout/Layout'
import { ItemForm } from '../../components/items/ItemForm'
import { createItem } from '../../db/items'
import { createItemSchema } from '../../lib/validation'
import type { Category } from '../../types/item'

interface FormErrors {
  name?: string
  category?: string
  color?: string
  brand?: string
  description?: string
  general?: string
}

export default createRoute(async (c) => {
  let errors: FormErrors = {}
  let formData: Record<string, string> = {}

  // POST処理（フォーム送信時）
  if (c.req.method === 'POST') {
    const db = c.env.DB
    const body = await c.req.parseBody()

    // フォームデータを取得
    formData = {
      name: (body.name as string) ?? '',
      category: (body.category as string) ?? '',
      color: (body.color as string) ?? '',
      brand: (body.brand as string) ?? '',
      description: (body.description as string) ?? '',
    }

    // バリデーション
    const validationResult = createItemSchema.safeParse({
      name: formData.name,
      category: formData.category,
      color: formData.color,
      brand: formData.brand || null,
      description: formData.description || null,
    })

    if (!validationResult.success) {
      // バリデーションエラーをフィールドごとに振り分け
      for (const err of validationResult.error.errors) {
        const field = err.path[0] as keyof FormErrors
        if (field && !errors[field]) {
          errors[field] = err.message
        }
      }
    } else {
      // アイテム作成
      try {
        await createItem(db, validationResult.data)
        // 成功したら一覧にリダイレクト
        return c.redirect('/', 302)
      } catch (e) {
        console.error('Failed to create item:', e)
        errors.general = 'アイテムの作成に失敗しました。もう一度お試しください。'
      }
    }
  }

  // フォーム表示（GET または エラー時の再表示）
  return c.render(
    <Layout>
      <div class="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div class="mb-8">
          <nav class="text-sm text-secondary mb-2">
            <a href="/" class="hover:text-accent transition-colors">ホーム</a>
            <span class="mx-2">/</span>
            <span class="text-primary">新規追加</span>
          </nav>
          <h1 class="text-2xl md:text-3xl font-bold text-primary">
            <i class="fa-solid fa-plus text-accent mr-3" aria-hidden="true"></i>
            アイテムを追加
          </h1>
          <p class="text-secondary mt-2">
            新しいアイテムをワードローブに追加します
          </p>
        </div>

        {/* Form */}
        <div class="bg-card-bg rounded-lg shadow-sm p-6">
          <ItemForm
            action="/items/new"
            method="POST"
            cancelUrl="/"
            submitLabel="追加"
            errors={errors}
            item={formData.name ? {
              id: 0,
              name: formData.name,
              category: formData.category as Category,
              color: formData.color,
              brand: formData.brand || null,
              description: formData.description || null,
              created_at: '',
              updated_at: '',
            } : undefined}
          />
        </div>
      </div>
    </Layout>
  )
})
