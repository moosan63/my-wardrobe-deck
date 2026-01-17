import { z } from 'zod'
import { CATEGORIES } from './constants'

/**
 * カテゴリのZodスキーマ
 */
export const categorySchema = z.enum(['outer', 'tops', 'bottoms', 'shoes', 'accessories'], {
  errorMap: () => ({
    message: `category must be one of: ${CATEGORIES.join(', ')}`,
  }),
})

/**
 * アイテム作成用バリデーションスキーマ
 */
export const createItemSchema = z.object({
  name: z
    .string({
      required_error: 'name is required',
    })
    .min(1, { message: 'name cannot be empty' }),
  category: categorySchema,
  color: z
    .string({
      required_error: 'color is required',
    })
    .min(1, { message: 'color cannot be empty' }),
  brand: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
})

/**
 * アイテム更新用バリデーションスキーマ
 * 全フィールドが任意
 */
export const updateItemSchema = z.object({
  name: z.string().min(1, { message: 'name cannot be empty' }).optional(),
  category: categorySchema.optional(),
  color: z.string().min(1, { message: 'color cannot be empty' }).optional(),
  brand: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
})

/**
 * カテゴリクエリパラメータのバリデーションスキーマ
 */
export const categoryQuerySchema = categorySchema.optional()

export type CreateItemSchemaType = z.infer<typeof createItemSchema>
export type UpdateItemSchemaType = z.infer<typeof updateItemSchema>
