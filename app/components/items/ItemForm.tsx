import type { ItemReadModel } from '../../src/item/domain'
import { CATEGORIES, CATEGORY_LABELS } from '../../lib/constants'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'

interface FormErrors {
  name?: string
  category?: string
  color?: string
  brand?: string
  description?: string
  general?: string
}

interface ItemFormProps {
  /** 編集時は既存のアイテムデータを渡す */
  item?: ItemReadModel
  /** バリデーションエラー */
  errors?: FormErrors
  /** 送信先URL */
  action: string
  /** HTTPメソッド（HonoXではPOSTで送信、_methodで上書き） */
  method?: 'POST' | 'PUT'
  /** キャンセルボタンの遷移先 */
  cancelUrl: string
  /** ボタンのラベル */
  submitLabel?: string
}

/**
 * アイテムの新規作成・編集フォーム
 * HonoXはSSRベースのため、フォーム送信はPOSTで行う
 */
export function ItemForm({
  item,
  errors = {},
  action,
  method = 'POST',
  cancelUrl,
  submitLabel = '保存',
}: ItemFormProps) {
  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat,
    label: CATEGORY_LABELS[cat],
  }))

  const colorOptions = [
    { value: '黒', label: '黒' },
    { value: '白', label: '白' },
    { value: 'グレー', label: 'グレー' },
    { value: 'ネイビー', label: 'ネイビー' },
    { value: '青', label: '青' },
    { value: '赤', label: '赤' },
    { value: 'ピンク', label: 'ピンク' },
    { value: 'オレンジ', label: 'オレンジ' },
    { value: '黄', label: '黄' },
    { value: '緑', label: '緑' },
    { value: '紫', label: '紫' },
    { value: '茶', label: '茶' },
    { value: 'ベージュ', label: 'ベージュ' },
    { value: 'カーキ', label: 'カーキ' },
  ]

  return (
    <form action={action} method="post">
      {/* HonoXでPUT/DELETEを使うためのhidden field */}
      {method !== 'POST' && (
        <input type="hidden" name="_method" value={method} />
      )}

      {/* General Error */}
      {errors.general && (
        <div class="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-xl text-accent-dark flex items-center">
          <i class="fa-solid fa-exclamation-triangle mr-3" aria-hidden="true"></i>
          {errors.general}
        </div>
      )}

      {/* Name Field - Required */}
      <Input
        name="name"
        label="アイテム名"
        value={item?.name}
        placeholder="例: カシミヤコート"
        required
        error={errors.name}
      />

      {/* Category Field - Required */}
      <Select
        name="category"
        label="カテゴリ"
        options={categoryOptions}
        value={item?.category}
        placeholder="カテゴリを選択"
        required
        error={errors.category}
      />

      {/* Color Field - Required */}
      <Select
        name="color"
        label="色"
        options={colorOptions}
        value={item?.color}
        placeholder="色を選択"
        required
        error={errors.color}
      />

      {/* Brand Field - Optional */}
      <Input
        name="brand"
        label="ブランド"
        value={item?.brand ?? ''}
        placeholder="例: UNIQLO"
        error={errors.brand}
      />

      {/* Description Field - Optional */}
      <Textarea
        name="description"
        label="説明・メモ"
        value={item?.description ?? ''}
        placeholder="購入時期や着用シーンなどのメモ"
        rows={4}
        error={errors.description}
      />

      {/* Action Buttons */}
      <div class="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border-light">
        <Button variant="ghost" href={cancelUrl}>
          <i class="fa-solid fa-times" aria-hidden="true"></i>
          キャンセル
        </Button>
        <Button type="submit" variant="accent">
          <i class="fa-solid fa-check" aria-hidden="true"></i>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
