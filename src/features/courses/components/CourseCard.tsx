import Link from 'next/link'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'
import type { Course } from '@/types/database'

interface CourseCardProps {
  course: Course
  index?: number
}

export function CourseCard({ course, index }: CourseCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          {index !== undefined && (
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
              Unit {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        {course.description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3">
            {course.description}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        {course.duration ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        ) : (
          <div />
        )}

        <Link
          href={`/curriculum/${course.id}`}
          className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg py-2"
          aria-label={`View course details for ${course.title}`}
        >
          <span>View Unit</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
