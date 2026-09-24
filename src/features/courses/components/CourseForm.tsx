'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createCourse, updateCourse } from '@/features/courses/actions'
import { ADMIN_PATH } from '@/lib/constants'
import { AlertCircle, ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import type { Course } from '@/types/database'
import type { ActionResult } from '@/lib/errors'

interface CourseFormProps {
  course?: Course
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const isEditing = Boolean(course)
  const [imageUrl, setImageUrl] = useState(course?.image_url || '')

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

      <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" required className="text-[#4C1D95]">
            عنوان الوحدة / Course Title
          </Label>
          <div className="mt-2">
            <Input
              id="title"
              name="title"
              defaultValue={course?.title || ''}
              placeholder="مثال: الوحدة 01: المبادئ الأساسية للتفكير المنطقي"
              required
              disabled={isPending}
            />
          </div>
        </div>

        {/* Category & Duration Row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="category" required className="text-[#4C1D95]">
              الفئة / Category
            </Label>
            <div className="mt-2">
              <select
                id="category"
                name="category"
                defaultValue={course?.category || 'curriculum'}
                disabled={isPending}
                className="flex h-11 w-full rounded-xl border border-[#EDE7FB] bg-white px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] min-h-[44px]"
              >
                <option value="curriculum">المنهج الدراسي (13 وحدة)</option>
                <option value="foundation">الدورة التأسيسية (4 مراحل)</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="duration" className="text-[#4C1D95]">
              المدة / Duration
            </Label>
            <div className="mt-2">
              <Input
                id="duration"
                name="duration"
                defaultValue={course?.duration || ''}
                placeholder="مثال: 6 أسابيع (24 ساعة)"
                disabled={isPending}
              />
            </div>
          </div>
        </div>

        {/* Image URL Input & Preview */}
        <div>
          <Label htmlFor="image_url" className="text-[#4C1D95]">
            رابط صورة الكورس / Course Image URL
          </Label>
          <div className="mt-2 flex flex-col sm:flex-row gap-4 items-start">
            <div className="relative flex-1 w-full">
              <Input
                id="image_url"
                name="image_url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-... أو أي رابط صورة"
                disabled={isPending}
              />
            </div>

            {imageUrl ? (
              <div className="relative h-20 w-32 shrink-0 rounded-xl overflow-hidden border border-[#EDE7FB] bg-[#F8F5FF]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={() => setImageUrl('')}
                />
              </div>
            ) : (
              <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#EDE7FB] bg-[#F8F5FF] text-[#6B5B95] text-xs">
                <ImageIcon className="h-5 w-5 mr-1" />
                <span>معاينة الصورة</span>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-[#6B5B95]">
            ضع رابط صورة مباشر (Unsplash / Imgur / Supabase Storage) ليتم عرضها في بطاقات الموقع.
          </p>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-[#4C1D95]">
            الوصف والأهداف الأكاديمية / Course Description
          </Label>
          <div className="mt-2">
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={course?.description || ''}
              placeholder="اكتب وصفاً مفصلاً ومبسطاً لأهداف وموضوعات الوحدة..."
              disabled={isPending}
            />
          </div>
        </div>

        {/* Publication Status Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-[#EDE7FB] bg-[#F8F5FF] p-4">
          <div>
            <span className="block text-sm font-semibold text-[#4C1D95]">
              حالة النشر / Published Status
            </span>
            <span className="block text-xs text-[#6B5B95]">
              عند التفعيل، يظهر الكورس فوراً في الموقع العام للزوار.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              value="true"
              defaultChecked={course ? course.is_published : true}
              className="h-5 w-5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-[#2D3748]">
              نشر فوراً (Publish)
            </label>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`${ADMIN_PATH}/courses`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#EDE7FB] bg-white px-5 py-2.5 text-sm font-semibold text-[#4C1D95] hover:bg-[#EDE7FB]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>إلغاء</span>
        </Link>

        <Button
          type="submit"
          size="lg"
          isLoading={isPending}
          disabled={isPending}
        >
          <Save className="mr-2 h-4 w-4" />
          <span>{isEditing ? 'حفظ التعديلات' : 'إنشاء الكورس'}</span>
        </Button>
      </div>
    </form>
  )
}
