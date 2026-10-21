'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { success, failure, getErrorMessage, type ActionResult } from '@/lib/errors'
import { revalidateInquiries } from '@/lib/cache'
import { contactFormSchema } from '@/features/contact/schemas'
import type { ContactSubmission } from '@/types/database'

export async function submitContact(formData: FormData): Promise<ActionResult<ContactSubmission | void>> {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      honeypot: formData.get('honeypot') as string,
    }

    const parsed = contactFormSchema.safeParse(rawData)
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message || 'يرجى التأكد من صحة البيانات المدخلة')
    }

    const { honeypot, ...dataToInsert } = parsed.data

    if (honeypot) {
      // Bot detected, silently succeed
      return success(undefined)
    }

    // Using createAdminClient bypasses RLS and ensures contact submissions are ALWAYS saved
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: dataToInsert.name.trim(),
        email: dataToInsert.email.trim().toLowerCase(),
        message: dataToInsert.message.trim(),
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting contact submission:', error)
      throw error
    }

    revalidateInquiries()

    return success(data as ContactSubmission)
  } catch (err) {
    console.error('Error in submitContact:', err)
    return failure(getErrorMessage(err))
  }
}

export async function markAsRead(id: string): Promise<ActionResult<ContactSubmission>> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidateInquiries()

    return success(data as ContactSubmission)
  } catch (err) {
    console.error('Error marking submission as read:', err)
    return failure(getErrorMessage(err))
  }
}

export async function markAsUnread(id: string): Promise<ActionResult<ContactSubmission>> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ is_read: false })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidateInquiries()

    return success(data as ContactSubmission)
  } catch (err) {
    console.error('Error marking submission as unread:', err)
    return failure(getErrorMessage(err))
  }
}

export async function deleteSubmission(id: string): Promise<ActionResult> {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidateInquiries()

    return success(undefined)
  } catch (err) {
    console.error('Error deleting submission:', err)
    return failure(getErrorMessage(err))
  }
}
