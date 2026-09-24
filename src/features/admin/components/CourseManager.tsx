'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Edit2,
  Trash2,
  ListOrdered,
  Clock,
  AlertCircle,
  Plus,
} from 'lucide-react'
import type { Course } from '@/types/database'
import {
  reorderCourses,
  toggleCoursePublished,
  deleteCourse,
} from '@/features/courses/actions'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { useToast } from '@/components/feedback/toast'
import { Switch } from '@/components/ui/switch'
import { ADMIN_PATH } from '@/lib/constants'

interface CourseManagerProps {
  initialCourses: Course[]
}

interface SortableCourseItemProps {
  course: Course
  index: number
  onTogglePublished: (id: string, current: boolean) => void
  onDelete: (id: string) => void
  isPending: boolean
}

function SortableCourseRow({
  course,
  index,
  onTogglePublished,
  onDelete,
  isPending,
}: SortableCourseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
        isDragging
          ? 'border-blue-400 bg-blue-50/50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Left: Drag handle + Title + Category */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex h-11 w-11 shrink-0 cursor-grab items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label={`Drag to reorder ${course.title}`}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-700">
          {index + 1}
        </span>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-gray-900 text-base">
            {course.title}
          </h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span
              className={`rounded-full px-2 py-0.5 font-medium uppercase tracking-wider text-[10px] ${
                course.category === 'foundation'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {course.category}
            </span>
            {course.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span>{course.duration}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Published toggle + Content link + Edit + Delete */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
        {/* Published Toggle */}
        <div className="flex items-center gap-2 pr-2">
          <Switch
            checked={course.is_published}
            onCheckedChange={() =>
              onTogglePublished(course.id, course.is_published)
            }
            disabled={isPending}
            aria-label={`Toggle publication status for ${course.title}`}
          />
          <span
            className={`text-xs font-medium ${
              course.is_published ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            {course.is_published ? 'Live' : 'Hidden'}
          </span>
        </div>

        {/* Content Topics */}
        <Link
          href={`${ADMIN_PATH}/courses/${course.id}/contents`}
          className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          title="Manage syllabus topics"
        >
          <ListOrdered className="h-4 w-4" />
          <span>Topics</span>
        </Link>

        {/* Edit */}
        <Link
          href={`${ADMIN_PATH}/courses/${course.id}`}
          className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          title="Edit course details"
        >
          <Edit2 className="h-4 w-4" />
          <span>Edit</span>
        </Link>

        {/* Delete with Confirmation */}
        <ConfirmDialog
          title="Delete Course"
          description={`Are you sure you want to delete "${course.title}"? All syllabus content points for this unit will also be removed permanently. This action cannot be undone.`}
          confirmLabel="Delete Course"
          variant="destructive"
          onConfirm={async () => onDelete(course.id)}
          trigger={
            <button
              type="button"
              disabled={isPending}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              title="Delete course"
              aria-label={`Delete ${course.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          }
        />
      </div>
    </div>
  )
}

export function CourseManager({ initialCourses }: CourseManagerProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const { addToast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const filteredCourses = courses.filter((c) =>
    filterCategory === 'all' ? true : c.category === filterCategory
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = courses.findIndex((item) => item.id === active.id)
    const newIndex = courses.findIndex((item) => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const previousCourses = [...courses]
    const updatedCourses = arrayMove(courses, oldIndex, newIndex).map(
      (course, index) => ({
        ...course,
        display_order: index,
      })
    )

    // Optimistic UI update
    setCourses(updatedCourses)

    const payload = {
      items: updatedCourses.map((c) => ({
        id: c.id,
        display_order: c.display_order,
      })),
    }

    startTransition(async () => {
      const res = await reorderCourses(payload)
      if (!res.success) {
        // Rollback
        setCourses(previousCourses)
        addToast({
          type: 'error',
          title: 'Reorder Failed',
          message: res.error || 'Failed to save new order. Reverted.',
        })
      } else {
        addToast({
          type: 'success',
          title: 'Order Saved',
          message: 'Curriculum display order updated successfully.',
        })
      }
    })
  }

  const handleTogglePublished = async (id: string, current: boolean) => {
    const nextState = !current
    const previousCourses = [...courses]

    // Optimistic update
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_published: nextState } : c))
    )

    startTransition(async () => {
      const res = await toggleCoursePublished(id, nextState)
      if (!res.success) {
        setCourses(previousCourses)
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: res.error || 'Failed to update publication status.',
        })
      } else {
        addToast({
          type: 'success',
          title: 'Status Updated',
          message: nextState
            ? 'Course is now visible to the public.'
            : 'Course is now hidden in draft mode.',
        })
      }
    })
  }

  const handleDeleteCourse = async (id: string) => {
    const previousCourses = [...courses]

    // Optimistic update
    setCourses((prev) => prev.filter((c) => c.id !== id))

    const res = await deleteCourse(id)
    if (!res.success) {
      setCourses(previousCourses)
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: res.error || 'Could not delete course.',
      })
    } else {
      addToast({
        type: 'success',
        title: 'Course Deleted',
        message: 'The course and its contents have been removed.',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 p-1">
          {['all', 'curriculum', 'foundation'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`min-h-[36px] rounded-lg px-3.5 py-1 text-xs font-semibold capitalize transition-colors ${
                filterCategory === cat
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {cat === 'all' ? 'All Units' : cat}
            </button>
          ))}
        </div>

        <Link
          href={`${ADMIN_PATH}/courses/new`}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Course</span>
        </Link>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No courses found
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            No courses exist in this view. Click &ldquo;New Course&rdquo; to add one.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredCourses.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filteredCourses.map((course, index) => (
                <SortableCourseRow
                  key={course.id}
                  course={course}
                  index={index}
                  onTogglePublished={handleTogglePublished}
                  onDelete={handleDeleteCourse}
                  isPending={isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
