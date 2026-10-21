'use client'

import type { Course } from '@/types/database'
import { CourseCard } from './CourseCard'
import { useTranslation } from '@/lib/i18n'
import { Sparkles } from 'lucide-react'

interface CourseListProps {
  courses: Course[]
}

export function CourseList({ courses }: CourseListProps) {
  const { t } = useTranslation()

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#EDE7FB] bg-white p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDE7FB] text-[#7C3AED]">
          <Sparkles className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-[#4C1D95]">
          {t('comingSoon')}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#6B5B95]">
          {t('comingSoonDesc')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <CourseCard key={course.id} course={course} index={index} />
      ))}
    </div>
  )
}
