import type { Course } from '@/types/database'
import { CourseCard } from './CourseCard'

interface CourseListProps {
  courses: Course[]
}

export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900">No courses available yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          The curriculum is currently being updated. Please check back soon!
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
