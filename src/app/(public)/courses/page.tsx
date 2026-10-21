import type { Metadata } from 'next'
import { GraduationCap } from 'lucide-react'
import { getCourses } from '@/features/courses/queries'
import { CourseList } from '@/features/courses/components/CourseList'
import { SITE_NAME } from '@/lib/constants'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'الكورسات التدريبية',
  description: `تصفح الكورسات والدورات التدريبية المتاحة في ${SITE_NAME}.`,
}

export default async function CoursesPage() {
  const courses = await getCourses('course')

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EDE7FB] bg-[#EDE7FB] px-4 py-1.5 text-xs font-semibold text-[#4C1D95]">
            <GraduationCap className="h-3.5 w-3.5 text-[#7C3AED]" />
            <span>الكورسات التدريبية</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#4C1D95] sm:text-4xl">
            الكورسات التدريبية
          </h1>

          <p className="mt-3 text-base text-[#6B5B95] leading-relaxed">
            دورات تدريبية مركزة لاكتساب المهارات العملية والتطبيقية بأسلوب سهل ومبسط.
          </p>
        </div>

        {/* Course Grid */}
        <div className="mt-12">
          <CourseList courses={courses} />
        </div>
      </div>
    </div>
  )
}
