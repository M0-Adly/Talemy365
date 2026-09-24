'use client'

import { useState, useTransition } from 'react'
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
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
} from 'lucide-react'
import type { CourseContent } from '@/types/database'
import {
  createContent,
  updateContent,
  deleteContent,
  reorderContents,
} from '@/features/courses/actions'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { useToast } from '@/components/feedback/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ContentManagerProps {
  courseId: string
  initialContents: CourseContent[]
}

interface SortableContentItemProps {
  item: CourseContent
  index: number
  onDelete: (id: string) => void
  onUpdate: (id: string, newTitle: string) => void
  isPending: boolean
}

function SortableContentRow({
  item,
  index,
  onDelete,
  onUpdate,
  isPending,
}: SortableContentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  }

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return
    onUpdate(item.id, editTitle.trim())
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors ${
        isDragging
          ? 'border-blue-400 bg-blue-50/50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label={`Drag to reorder topic ${item.title}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-700">
          {index + 1}
        </span>

        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-9 py-1 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') setIsEditing(false)
              }}
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              title="Save"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="truncate font-medium text-gray-900 text-sm">
            {item.title}
          </span>
        )}
      </div>

      {!isEditing && (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            title="Edit topic title"
            aria-label={`Edit ${item.title}`}
          >
            <Edit2 className="h-4 w-4" />
          </button>

          <ConfirmDialog
            title="Delete Topic"
            description={`Are you sure you want to delete "${item.title}"?`}
            confirmLabel="Delete"
            variant="destructive"
            onConfirm={async () => onDelete(item.id)}
            trigger={
              <button
                type="button"
                disabled={isPending}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                title="Delete topic"
                aria-label={`Delete ${item.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            }
          />
        </div>
      )}
    </div>
  )
}

export function ContentManager({
  courseId,
  initialContents,
}: ContentManagerProps) {
  const [contents, setContents] = useState<CourseContent[]>(initialContents)
  const [newTitle, setNewTitle] = useState('')
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = contents.findIndex((item) => item.id === active.id)
    const newIndex = contents.findIndex((item) => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const previous = [...contents]
    const reordered = arrayMove(contents, oldIndex, newIndex).map(
      (item, idx) => ({
        ...item,
        display_order: idx,
      })
    )

    // Optimistic UI
    setContents(reordered)

    const payload = {
      items: reordered.map((item) => ({
        id: item.id,
        display_order: item.display_order,
      })),
    }

    startTransition(async () => {
      const res = await reorderContents(courseId, payload)
      if (!res.success) {
        setContents(previous)
        addToast({
          type: 'error',
          title: 'Reorder Failed',
          message: res.error || 'Failed to reorder topics. Reverted.',
        })
      } else {
        addToast({
          type: 'success',
          title: 'Topics Reordered',
          message: 'New sequence saved.',
        })
      }
    })
  }

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const formData = new FormData()
    formData.append('title', newTitle.trim())

    startTransition(async () => {
      const res = await createContent(courseId, formData)
      if (res.success) {
        setContents((prev) => [...prev, res.data])
        setNewTitle('')
        addToast({
          type: 'success',
          title: 'Topic Added',
          message: 'New topic added to syllabus.',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Could Not Add Topic',
          message: res.error || 'Validation or database error.',
        })
      }
    })
  }

  const handleUpdateTopic = async (id: string, title: string) => {
    const formData = new FormData()
    formData.append('title', title)

    startTransition(async () => {
      const res = await updateContent(id, formData)
      if (res.success) {
        setContents((prev) =>
          prev.map((c) => (c.id === id ? { ...c, title } : c))
        )
        addToast({
          type: 'success',
          title: 'Topic Updated',
          message: 'Changes saved.',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: res.error || 'Failed to update topic.',
        })
      }
    })
  }

  const handleDeleteTopic = async (id: string) => {
    const previous = [...contents]
    setContents((prev) => prev.filter((c) => c.id !== id))

    const res = await deleteContent(id, courseId)
    if (!res.success) {
      setContents(previous)
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: res.error || 'Could not delete topic.',
      })
    } else {
      addToast({
        type: 'success',
        title: 'Topic Removed',
        message: 'Topic deleted from syllabus.',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Add new topic inline form */}
      <form
        onSubmit={handleAddTopic}
        className="flex flex-col sm:flex-row items-stretch gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs"
      >
        <div className="flex-1">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new topic or lecture title (e.g. Introduction to Aristotelian Syllogisms)..."
            disabled={isPending}
            required
          />
        </div>
        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending || !newTitle.trim()}
          className="shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          <span>Add Topic</span>
        </Button>
      </form>

      {/* Topics list with DnD */}
      {contents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No topics yet
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Use the form above to add the first content point or lecture topic.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={contents.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2.5">
              {contents.map((item, index) => (
                <SortableContentRow
                  key={item.id}
                  item={item}
                  index={index}
                  onDelete={handleDeleteTopic}
                  onUpdate={handleUpdateTopic}
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
