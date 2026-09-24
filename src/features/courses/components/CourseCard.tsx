'use client'

import Link from 'next/link'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'
import type { Course } from '@/types/database'
import { useTranslation } from '@/lib/i18n'

interface CourseCardProps {
  course: Course
  index?: number
}

export function CourseCard({ course, index }: CourseCardProps) {
  const { t } = useTranslation()

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EDE7FB] bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#8B5CF6]/40 hover:shadow-md">
      {/* Course Image Header if present */}
      {course.image_url && (
        <div className="relative h-44 w-full overflow-hidden bg-[#EDE7FB]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {index !== undefined && (
            <span className="absolute bottom-3 right-3 rounded-md bg-[#4C1D95]/80 backdrop-blur-xs px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {t('unit')} {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>
      )}

      <div className="p-6">
        {!course.image_url && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#6C2BD9] transition-colors group-hover:bg-[#6C2BD9] group-hover:text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            {index !== undefined && (
              <span className="text-xs font-bold tracking-widest uppercase text-[#6B5B95]">
                {t('unit')} {String(index + 1).padStart(2, '0')}
              </span>
            )}
          </div>
        )}

        <h3 className="mt-2 text-xl font-bold text-[#4C1D95] group-hover:text-[#6C2BD9] transition-colors">
          {course.title}
        </h3>

        {course.description && (
          <p className="mt-2 text-sm leading-relaxed text-[#2D3748] line-clamp-3">
            {course.description}
          </p>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-[#EDE7FB] p-4 px-6 bg-[#F8F5FF]/50">
        {course.duration ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#6B5B95]">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        ) : (
          <div />
        )}

        <Link
          href={`/curriculum/${course.id}`}
          className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-[#7C3AED] hover:text-[#6C2BD9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-lg py-2"
          aria-label={`View course details for ${course.title}`}
        >
          <span>{t('viewUnit')}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
