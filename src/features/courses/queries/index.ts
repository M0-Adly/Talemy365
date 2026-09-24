import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Course, CourseWithContents, CourseCategory } from '@/types/database'

export async function getCourses(category: CourseCategory): Promise<Course[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error(`Failed to fetch courses for category "${category}":`, error.message)
      return []
    }

    return (data || []) as Course[]
  } catch (err) {
    console.error(`Error in getCourses(${category}):`, err)
    return []
  }
}

export async function getCourse(id: string): Promise<CourseWithContents | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('courses')
      .select(
        `
        *,
        course_contents (
          id,
          course_id,
          title,
          display_order,
          created_at
        )
      `
      )
      .eq('id', id)
      .eq('is_published', true)
      .order('display_order', {
        referencedTable: 'course_contents',
        ascending: true,
      })
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error(`Failed to fetch course "${id}":`, error.message)
      return null
    }

    return data as CourseWithContents
  } catch (err) {
    console.error(`Error in getCourse(${id}):`, err)
    return null
  }
}

export async function getAllCourses(): Promise<Course[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('category', { ascending: true })
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Failed to fetch all courses:', error.message)
      return []
    }

    return (data || []) as Course[]
  } catch (err) {
    console.error('Error in getAllCourses:', err)
    return []
  }
}

export async function getAllCoursesWithContents(
  category?: CourseCategory
): Promise<CourseWithContents[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
    const supabase = await createClient()

    let query = supabase
      .from('courses')
      .select(
        `
        *,
        course_contents (
          id,
          course_id,
          title,
          display_order,
          created_at
        )
      `
      )
      .order('display_order', { ascending: true })
      .order('display_order', {
        referencedTable: 'course_contents',
        ascending: true,
      })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch courses with contents:', error.message)
      return []
    }

    return (data || []) as CourseWithContents[]
  } catch (err) {
    console.error('Error in getAllCoursesWithContents:', err)
    return []
  }
}
