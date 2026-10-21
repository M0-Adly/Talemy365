import type { Metadata } from 'next'
import { getAllCourses } from '@/features/courses/queries'
import { CourseManager } from '@/features/admin/components/CourseManager'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'إدارة المناهج والكورسات',
}

export default async function AdminCoursesPage() {
  const courses = await getAllCourses()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#4C1D95] sm:text-3xl">
          إدارة المناهج التعليمية والكورسات
        </h1>
        <p className="mt-1 text-xs text-[#6B5B95]">
          يمكنك إضافة وتعديل وحذف الكورسات، والتحكم في ظهورها أو ترتيبها بالسحب والإفلات.
        </p>
      </div>

      <CourseManager initialCourses={courses} />
    </div>
  )
}
