import type { Metadata } from 'next'
import { getAllCourses } from '@/features/courses/queries'
import { CourseManager } from '@/features/admin/components/CourseManager'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Manage Courses & Units',
}

export default async function AdminCoursesPage() {
  const courses = await getAllCourses()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Courses & Curriculum Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Drag and drop rows using the handle to rearrange sequence. Changes persist
          immediately.
        </p>
      </div>

      <CourseManager initialCourses={courses} />
    </div>
  )
}
