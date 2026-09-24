export const SITE_NAME = 'Taal3amy'
export const SITE_DESCRIPTION = 'Your gateway to comprehensive learning — discover our curriculum, foundation courses, and educational programs.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const ADMIN_PATH = '/mudir'
export const LOGIN_PATH = '/mudir/login'

export const CACHE_TAGS = {
  courses: 'courses',
  course: (id: string) => `course-${id}`,
  contactSubmissions: 'contact-submissions',
  dashboard: 'dashboard-stats',
} as const

export const REVALIDATE_INTERVAL = 3600 // 1 hour for public pages
