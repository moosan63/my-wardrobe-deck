import { createRoute } from 'honox/factory'
import { deleteItem } from '../../../db/items'

// POST: 削除処理
export const POST = createRoute(async (c) => {
  const db = c.env.DB
  const idParam = c.req.param('id') ?? ''
  const id = parseInt(idParam, 10)

  // IDバリデーション
  if (isNaN(id) || id <= 0) {
    return c.redirect('/', 302)
  }

  try {
    const deleted = await deleteItem(db, id)
    if (deleted) {
      return c.redirect('/', 302)
    }
  } catch (e) {
    console.error('Failed to delete item:', e)
  }

  // 削除失敗時は詳細ページにリダイレクト
  return c.redirect(`/items/${id}`, 302)
})
