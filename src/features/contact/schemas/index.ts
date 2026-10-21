import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  whatsapp: z
    .string()
    .max(30, 'WhatsApp number is too long')
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be 5000 characters or less'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
