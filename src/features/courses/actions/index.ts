'use server'

import { createClient } from '@/lib/supabase/server'
import { success, failure, getErrorMessage, type ActionResult } from '@/lib/errors'
import { revalidateCourses, revalidateCourse } from '@/lib/cache'
import { courseSchema, contentSchema, reorderSchema } from '@/features/courses/schemas'
import type { Course, CourseContent } from '@/types/database'

export async function createCourse(formData: FormData): Promise<ActionResult<Course>> {
  try {
    const rawData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      category: formData.get('category') as string,
      duration: (formData.get('duration') as string) || null,
      icon: (formData.get('icon') as string) || null,
      is_published: formData.get('is_published') === 'true' || formData.get('is_published') === 'on',
    }

    const parsed = courseSchema.safeParse(rawData)
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message || 'Validation failed')
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .insert(parsed.data)
      .select()
      .single()

    if (error) throw error

    revalidateCourses()

    return success(data as Course)
  } catch (err) {
    console.error('Error creating course:', err)
    return failure(getErrorMessage(err))
  }
}

export async function updateCourse(id: string, formData: FormData): Promise<ActionResult<Course>> {
  try {
    const rawData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      category: formData.get('category') as string,
      duration: (formData.get('duration') as string) || null,
      icon: (formData.get('icon') as string) || null,
      is_published: formData.get('is_published') === 'true' || formData.get('is_published') === 'on',
    }

    const parsed = courseSchema.safeParse(rawData)
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message || 'Validation failed')
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .update(parsed.data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidateCourse(id)

    return success(data as Course)
  } catch (err) {
    console.error('Error updating course:', err)
    return failure(getErrorMessage(err))
  }
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidateCourse(id)

    return success(undefined)
  } catch (err) {
    console.error('Error deleting course:', err)
    return failure(getErrorMessage(err))
  }
}

export async function toggleCoursePublished(id: string, isPublished: boolean): Promise<ActionResult<Course>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .update({ is_published: isPublished })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidateCourse(id)

    return success(data as Course)
  } catch (err) {
    console.error('Error toggling course published state:', err)
    return failure(getErrorMessage(err))
  }
}

export async function reorderCourses(data: { items: { id: string; display_order: number }[] }): Promise<ActionResult> {
  try {
    const parsed = reorderSchema.safeParse(data)
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message || 'Validation failed')
    }

    const supabase = await createClient()
    
    for (const item of parsed.data.items) {
      const { error } = await supabase
        .from('courses')
        .update({ display_order: item.display_order })
        .eq('id', item.id)
      
      if (error) throw error
    }

    revalidateCourses()

    return success(undefined)
  } catch (err) {
    console.error('Error reordering courses:', err)
    return failure(getErrorMessage(err))
  }
}

export async function createContent(courseId: string, formData: FormData): Promise<ActionResult<CourseContent>> {
  try {
    const rawData = {
      title: formData.get('title') as string,
    }

    const parsed = contentSchema.safeParse(rawData)
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message || 'Validation failed')
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('course_contents')
      .insert({ ...parsed.data, course_id: courseId })
      .select()
      .single()

    if (error) throw error

    revalidateCourse(courseId)

    return success(data as CourseContent)
  } catch (err) {
    console.error('Error creating course content:', err)
    return failure(getErrorMessage(err))
  }
}

export async function updateContent(id: string, formData: FormData): Promise<ActionResult<CourseContent>> {
  try {
    const rawData = {
      title: formData.get('title') as string,
    }

    const parsed = contentSchema.safeParse(rawData)
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message || 'Validation failed')
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('course_contents')
      .update(parsed.data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (data?.course_id) {
      revalidateCourse(data.course_id)
    }

    return success(data as CourseContent)
  } catch (err) {
    console.error('Error updating course content:', err)
    return failure(getErrorMessage(err))
  }
}

export async function deleteContent(id: string, courseId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('course_contents')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidateCourse(courseId)

    return success(undefined)
  } catch (err) {
    console.error('Error deleting course content:', err)
    return failure(getErrorMessage(err))
  }
}

export async function reorderContents(courseId: string, data: { items: { id: string; display_order: number }[] }): Promise<ActionResult> {
  try {
    const parsed = reorderSchema.safeParse(data)
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message || 'Validation failed')
    }

    const supabase = await createClient()
    
    for (const item of parsed.data.items) {
      const { error } = await supabase
        .from('course_contents')
        .update({ display_order: item.display_order })
        .eq('id', item.id)
      
      if (error) throw error
    }

    revalidateCourse(courseId)

    return success(undefined)
  } catch (err) {
    console.error('Error reordering course contents:', err)
    return failure(getErrorMessage(err))
  }
}
