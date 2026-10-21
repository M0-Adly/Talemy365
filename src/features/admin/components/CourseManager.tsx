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
  AlertCircle,
  Plus,
  ImageIcon,
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

  const categoryName = course.category === 'curriculum' ? 'منهج تعليمي' : 'كورس'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
        isDragging
          ? 'border-[#7C3AED] bg-[#EDE7FB]/70 shadow-md'
          : 'border-[#EDE7FB] bg-white hover:border-[#8B5CF6]/40 shadow-xs'
      }`}
    >
      {/* Left: Drag handle + Thumbnail + Title + Category */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex h-11 w-11 shrink-0 cursor-grab items-center justify-center rounded-xl text-[#6B5B95] hover:bg-[#EDE7FB] active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          aria-label={`اسحب لإعادة الترتيب: ${course.title}`}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EDE7FB] text-xs font-bold text-[#4C1D95]">
          {index + 1}
        </span>

        {/* Thumbnail if available */}
        {course.image_url ? (
          <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-[#EDE7FB] bg-[#F8F5FF]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#EDE7FB] bg-[#F8F5FF] text-[#6B5B95]">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate font-bold text-[#4C1D95] text-base">
            {course.title}
          </h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-[#EDE7FB] px-2 py-0.5 font-bold text-[#6C2BD9]">
              {categoryName}
            </span>
            {course.duration && (
              <span className="text-[#6B5B95]">{course.duration}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Published toggle + Edit + Delete */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#EDE7FB] pt-3 sm:border-0 sm:pt-0">
        {/* Published Toggle */}
        <div className="flex items-center gap-2 pr-2">
          <Switch
            checked={course.is_published}
            onCheckedChange={() =>
              onTogglePublished(course.id, course.is_published)
            }
            disabled={isPending}
            aria-label={`تغيير حالة النشر: ${course.title}`}
          />
          <span
            className={`text-xs font-bold ${
              course.is_published ? 'text-[#7C3AED]' : 'text-[#6B5B95]'
            }`}
          >
            {course.is_published ? 'منشور' : 'مسودة'}
          </span>
        </div>

        {/* Edit */}
        <Link
          href={`${ADMIN_PATH}/courses/${course.id}`}
          className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#EDE7FB] bg-white px-3.5 py-2 text-xs font-bold text-[#4C1D95] hover:bg-[#EDE7FB] transition-colors"
          title="تعديل الكورس"
        >
          <Edit2 className="h-4 w-4 text-[#7C3AED]" />
          <span>تعديل</span>
        </Link>

        {/* Delete with Confirmation */}
        <ConfirmDialog
          title="تأكيد الحذف"
          description={`هل أنت متأكد من رغبتك في حذف "${course.title}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmLabel="حذف نهائي"
          variant="destructive"
          onConfirm={async () => onDelete(course.id)}
          trigger={
            <button
              type="button"
              disabled={isPending}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
              title="حذف"
              aria-label={`حذف ${course.title}`}
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
        setCourses(previousCourses)
        addToast({
          type: 'error',
          title: 'فشل الحفظ',
          message: res.error || 'تعذر حفظ الترتيب الجديد.',
        })
      } else {
        addToast({
          type: 'success',
          title: 'تم الترتيب',
          message: 'تم حفظ الترتيب الجديد بنجاح.',
        })
      }
    })
  }

  const handleTogglePublished = async (id: string, current: boolean) => {
    const nextState = !current
    const previousCourses = [...courses]

    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_published: nextState } : c))
    )

    startTransition(async () => {
      const res = await toggleCoursePublished(id, nextState)
      if (!res.success) {
        setCourses(previousCourses)
        addToast({
          type: 'error',
          title: 'خطأ',
          message: res.error || 'تعذر تحديث حالة النشر.',
        })
      } else {
        addToast({
          type: 'success',
          title: 'تم التحديث',
          message: nextState
            ? 'أصبح الكورس معروضاً الآن للزوار.'
            : 'تم تحويل الكورس إلى مسودة.',
        })
      }
    })
  }

  const handleDeleteCourse = async (id: string) => {
    const previousCourses = [...courses]
    setCourses((prev) => prev.filter((c) => c.id !== id))

    const res = await deleteCourse(id)
    if (!res.success) {
      setCourses(previousCourses)
      addToast({
        type: 'error',
        title: 'فشل الحذف',
        message: res.error || 'تعذر حذف الكورس.',
      })
    } else {
      addToast({
        type: 'success',
        title: 'تم الحذف',
        message: 'تم حذف الكورس بنجاح.',
      })
    }
  }

  const filters = [
    { key: 'all', label: 'الكل' },
    { key: 'curriculum', label: 'المناهج التعليمية' },
    { key: 'course', label: 'الكورسات' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-[#EDE7FB] p-1">
          {filters.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterCategory(tab.key)}
              className={`min-h-[38px] rounded-lg px-4 py-1 text-xs font-bold transition-all ${
                filterCategory === tab.key
                  ? 'bg-white text-[#4C1D95] shadow-xs'
                  : 'text-[#6B5B95] hover:text-[#4C1D95]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href={`${ADMIN_PATH}/courses/new`}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#6C2BD9]"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة كورس أو منهج</span>
        </Link>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#EDE7FB] bg-white p-12 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-[#A78BFA]" />
          <h3 className="mt-3 text-base font-bold text-[#4C1D95]">
            سوف يتم الإعلان قريباً
          </h3>
          <p className="mt-1 text-xs text-[#6B5B95]">
            لم تقم بإضافة أي عناصر في هذا القسم بعد. اضغط &ldquo;إضافة كورس أو منهج&rdquo; للبدء.
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
