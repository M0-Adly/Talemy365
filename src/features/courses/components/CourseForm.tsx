'use client'

import { useActionState, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createCourse, updateCourse } from '@/features/courses/actions'
import { ADMIN_PATH } from '@/lib/constants'
import { AlertCircle, ArrowLeft, Save, Upload, Link as LinkIcon, X } from 'lucide-react'
import type { Course } from '@/types/database'
import type { ActionResult } from '@/lib/errors'

interface CourseFormProps {
  course?: Course
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const isEditing = Boolean(course)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState(course?.image_url || '')
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file')

  const [state, formAction, isPending] = useActionState(
    async (_prevState: ActionResult<Course> | null, formData: FormData) => {
      // Ensure the image_url state is set in formData
      formData.set('image_url', imageUrl)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert file to base64 Data URL for instant storage & preview
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        setImageUrl(result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {state && !state.success && (
        <div className="flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-rose-900">حدث خطأ أثناء الحفظ</h4>
            <p className="mt-0.5">{state.error}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Category: المناهج التعليمية أو الكورسات */}
        <div>
          <Label htmlFor="category" required className="text-base font-bold text-[#4C1D95]">
            القسم
          </Label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer font-bold transition-all ${
                (course?.category || 'curriculum') === 'curriculum'
                  ? 'border-[#7C3AED] bg-[#EDE7FB] text-[#4C1D95]'
                  : 'border-[#EDE7FB] bg-white text-[#2D3748] hover:bg-[#F8F5FF]'
              }`}
            >
              <input
                type="radio"
                name="category"
                value="curriculum"
                defaultChecked={course ? course.category === 'curriculum' : true}
                className="sr-only"
              />
              <span>المناهج التعليمية</span>
            </label>

            <label
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer font-bold transition-all ${
                course?.category === 'course'
                  ? 'border-[#7C3AED] bg-[#EDE7FB] text-[#4C1D95]'
                  : 'border-[#EDE7FB] bg-white text-[#2D3748] hover:bg-[#F8F5FF]'
              }`}
            >
              <input
                type="radio"
                name="category"
                value="course"
                defaultChecked={course?.category === 'course'}
                className="sr-only"
              />
              <span>الكورسات</span>
            </label>
          </div>
        </div>

        {/* Title / Name */}
        <div>
          <Label htmlFor="title" required className="text-base font-bold text-[#4C1D95]">
            اسم الكورس أو المنهج التعليمي
          </Label>
          <div className="mt-2">
            <Input
              id="title"
              name="title"
              defaultValue={course?.title || ''}
              placeholder="اكتب اسم الكورس أو المنهج..."
              required
              disabled={isPending}
              className="text-base h-12 border-[#EDE7FB] focus-visible:ring-[#7C3AED]"
            />
          </div>
        </div>

        {/* Image Upload / URL */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-base font-bold text-[#4C1D95]">
              صورة الكورس أو المنهج
            </Label>
            <div className="flex items-center gap-1 bg-[#F8F5FF] p-1 rounded-lg border border-[#EDE7FB]">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  uploadMode === 'file'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#6B5B95] hover:text-[#4C1D95]'
                }`}
              >
                رفع من الجهاز
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  uploadMode === 'url'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#6B5B95] hover:text-[#4C1D95]'
                }`}
              >
                رابط صورة
              </button>
            </div>
          </div>

          <input type="hidden" name="image_url" value={imageUrl} />

          {/* Mode 1: File Upload */}
          {uploadMode === 'file' && (
            <div className="mt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="flex flex-col items-center justify-center w-full min-h-[120px] rounded-2xl border-2 border-dashed border-[#7C3AED]/40 bg-[#F8F5FF] hover:bg-[#EDE7FB]/50 p-4 transition-colors cursor-pointer"
              >
                <Upload className="h-8 w-8 text-[#7C3AED] mb-2" />
                <span className="text-sm font-bold text-[#4C1D95]">
                  اضغط لاختيار صورة من جهازك
                </span>
                <span className="text-xs text-[#6B5B95] mt-1">
                  يدعم صور JPG و PNG و WebP
                </span>
              </button>
            </div>
          )}

          {/* Mode 2: Direct URL */}
          {uploadMode === 'url' && (
            <div className="mt-3 relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#6B5B95]">
                <LinkIcon className="h-4 w-4" />
              </div>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={isPending}
                className="pr-10 border-[#EDE7FB] focus-visible:ring-[#7C3AED]"
              />
            </div>
          )}

          {/* Live Preview */}
          {imageUrl && (
            <div className="mt-4 relative h-48 w-full sm:w-80 rounded-2xl overflow-hidden border-2 border-[#EDE7FB] bg-[#F8F5FF] shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                title="إزالة الصورة"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Optional Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-bold text-[#4C1D95]">
            نبذة أو وصف (اختياري)
          </Label>
          <div className="mt-2">
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={course?.description || ''}
              placeholder="اكتب نبذة مختصرة عن الكورس أو المنهج إن رغبت..."
              disabled={isPending}
              className="border-[#EDE7FB] focus-visible:ring-[#7C3AED]"
            />
          </div>
        </div>

        {/* Publish Checkbox */}
        <div className="flex items-center justify-between rounded-xl border border-[#EDE7FB] bg-[#F8F5FF] p-4">
          <div>
            <span className="block text-sm font-bold text-[#4C1D95]">
              حالة النشر
            </span>
            <span className="block text-xs text-[#6B5B95]">
              تفعيل هذا الخيار ليظهر الكورس فوراً لزوار الموقع.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              value="true"
              defaultChecked={course ? course.is_published : true}
              className="h-5 w-5 rounded border-[#EDE7FB] text-[#7C3AED] focus:ring-[#7C3AED]"
            />
            <label htmlFor="is_published" className="text-sm font-bold text-[#2D3748] cursor-pointer">
              نشر فوراً
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`${ADMIN_PATH}/courses`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#EDE7FB] bg-white px-5 py-2.5 text-sm font-bold text-[#4C1D95] hover:bg-[#EDE7FB]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>رجوع</span>
        </Link>

        <Button
          type="submit"
          size="lg"
          isLoading={isPending}
          disabled={isPending}
          className="px-8 font-bold"
        >
          <Save className="ml-2 h-4 w-4" />
          <span>{isEditing ? 'حفظ التعديلات' : 'إضافة الآن'}</span>
        </Button>
      </div>
    </form>
  )
}
