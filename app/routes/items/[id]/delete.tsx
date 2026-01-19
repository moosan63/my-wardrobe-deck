import { createRoute } from 'honox/factory'
import { DeleteItem } from '../../../src/item'
import { D1ItemRepository } from '../../../infrastructure/d1/item-repository-impl'

// POST: 削除処理
export const POST = createRoute(async (c) => {
  const db = c.env.DB
  const idParam = c.req.param('id') ?? ''
  const id = parseInt(idParam, 10)

  // リポジトリとユースケースのインスタンス化
  const itemRepository = new D1ItemRepository(db)
  const deleteItem = new DeleteItem(itemRepository)

  // ユースケースを実行
  const result = await deleteItem.execute(id)

  if (result.isOk()) {
    // 成功したらホームにリダイレクト
    return c.redirect('/', 302)
  }

  // エラー時はログ出力して詳細ページにリダイレクト
  console.error('Failed to delete item:', result.error)

  // INVALID_ITEM_IDの場合はホームにリダイレクト
  if (result.error.type === 'INVALID_ITEM_ID') {
    return c.redirect('/', 302)
  }

  // 削除失敗時は詳細ページにリダイレクト
  return c.redirect(`/items/${id}`, 302)
})
