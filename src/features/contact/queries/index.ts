import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import type { ContactSubmission } from '@/types/database'

export async function getSubmissions(): Promise<ContactSubmission[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch contact submissions:', error.message)
      return []
    }

    return (data || []) as ContactSubmission[]
  } catch (err) {
    console.error('Error in getSubmissions:', err)
    return []
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return 0
    const supabase = createAdminClient()

    const { count, error } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)

    if (error) {
      console.error('Failed to fetch unread count:', error.message)
      return 0
    }

    return count ?? 0
  } catch (err) {
    console.error('Error in getUnreadCount:', err)
    return 0
  }
}
