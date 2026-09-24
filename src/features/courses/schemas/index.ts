import { z } from 'zod'

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .nullable()
    .default(null),
  category: z.enum(['curriculum', 'foundation']),
  duration: z
    .string()
    .max(100, 'Duration must be 100 characters or less')
    .nullable()
    .default(null),
  icon: z
    .string()
    .max(100, 'Icon must be 100 characters or less')
    .nullable()
    .default(null),
  image_url: z
    .string()
    .max(1000, 'Image URL must be 1000 characters or less')
    .nullable()
    .default(null),
  is_published: z.boolean().default(true),
})

export type CourseFormData = z.infer<typeof courseSchema>

export const contentSchema = z.object({
  title: z
    .string()
    .min(1, 'Content title is required')
    .max(500, 'Content title must be 500 characters or less'),
})

export type ContentFormData = z.infer<typeof contentSchema>

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid('Invalid ID'),
      display_order: z.number().int().min(0),
    })
  ),
})

export type ReorderData = z.infer<typeof reorderSchema>
