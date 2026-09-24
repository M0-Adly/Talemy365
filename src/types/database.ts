export type CourseCategory = 'curriculum' | 'foundation'

export interface Course {
  id: string
  title: string
  description: string | null
  category: CourseCategory
  duration: string | null
  display_order: number
  is_published: boolean
  icon: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface CourseContent {
  id: string
  course_id: string
  title: string
  display_order: number
  created_at: string
}

export interface CourseWithContents extends Course {
  course_contents: CourseContent[]
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

export interface AdminProfile {
  id: string
  full_name: string | null
  role: string
  created_at: string
}
