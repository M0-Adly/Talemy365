'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

import { createCourse, updateCourse } from '@/features/courses/actions'
import { ADMIN_PATH } from '@/lib/constants'
import { AlertCircle, ArrowLeft, Save } from 'lucide-react'
import type { Course } from '@/types/database'
import type { ActionResult } from '@/lib/errors'

interface CourseFormProps {
  course?: Course
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const isEditing = Boolean(course)

  const [state, formAction, isPending] = useActionState(
    async (_prevState: ActionResult<Course> | null, formData: FormData) => {
      let res: ActionResult<Course>

      if (isEditing && course) {
        res = await updateCourse(course.id, formData)
      } else {
        res = await createCourse(formData)
      }

      if (res.success) {
        router.push(`${ADMIN_PATH}/courses`)
        router.refresh()
      }

      return res
    },
    null
  )

  return (
    <form action={formAction} className="space-y-8">
      {state && !state.success && (
        <div className="flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-900">Submission Error</h4>
            <p className="mt-0.5">{state.error}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" required>
            Course / Unit Title
          </Label>
          <div className="mt-2">
            <Input
              id="title"
              name="title"
              defaultValue={course?.title || ''}
              placeholder="e.g. Unit 01: Core Principles of Classical Logic"
              required
              disabled={isPending}
            />
          </div>
        </div>

        {/* Category & Duration Row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="category" required>
              Category
            </Label>
            <div className="mt-2">
              <select
                id="category"
                name="category"
                defaultValue={course?.category || 'curriculum'}
                disabled={isPending}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px]"
              >
                <option value="curriculum">Curriculum (13 Units)</option>
                <option value="foundation">Foundation (4 Phases)</option>
              </select>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Select whether this unit belongs to the standard curriculum or foundation course.
            </p>
          </div>

          <div>
            <Label htmlFor="duration">
              Duration / Schedule
            </Label>
            <div className="mt-2">
              <Input
                id="duration"
                name="duration"
                defaultValue={course?.duration || ''}
                placeholder="e.g. 6 Weeks (24 Hours)"
                disabled={isPending}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">
            Course Description & Overview
          </Label>
          <div className="mt-2">
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={course?.description || ''}
              placeholder="Provide a thorough pedagogical overview of this course unit..."
              disabled={isPending}
            />
          </div>
        </div>

        {/* Publication Status Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div>
            <span className="block text-sm font-semibold text-gray-900">
              Published Status
            </span>
            <span className="block text-xs text-gray-500">
              If enabled, this course is publicly viewable on the site.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              value="true"
              defaultChecked={course ? course.is_published : true}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
              Publish immediately
            </label>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`${ADMIN_PATH}/courses`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Cancel</span>
        </Link>

        <Button
          type="submit"
          size="lg"
          isLoading={isPending}
          disabled={isPending}
        >
          <Save className="mr-2 h-4 w-4" />
          <span>{isEditing ? 'Save Changes' : 'Create Course'}</span>
        </Button>
      </div>
    </form>
  )
}
