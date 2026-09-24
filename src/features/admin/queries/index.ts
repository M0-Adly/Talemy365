import 'server-only'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return {
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        unreadMessages: 0,
        recentCourses: [],
      }
    }

    const supabase = await createClient()

    const [coursesResult, publishedResult, unreadResult, recentResult] =
      await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true),
        supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false),
        supabase
          .from('courses')
          .select('id, title, updated_at, is_published, category')
          .order('updated_at', { ascending: false })
          .limit(5),
      ])

    if (coursesResult.error) {
      console.error('Error fetching dashboard stats:', coursesResult.error.message)
    }

    const total = coursesResult.count ?? 0
    const published = publishedResult.count ?? 0

    return {
      totalCourses: total,
      publishedCourses: published,
      draftCourses: Math.max(0, total - published),
      unreadMessages: unreadResult.count ?? 0,
      recentCourses: (recentResult.data ?? []) as Array<{
        id: string
        title: string
        updated_at: string
        is_published: boolean
        category: string
      }>,
    }
  } catch (err) {
    console.error('Error in getDashboardStats:', err)
    return {
      totalCourses: 0,
      publishedCourses: 0,
      draftCourses: 0,
      unreadMessages: 0,
      recentCourses: [],
    }
  }
}
