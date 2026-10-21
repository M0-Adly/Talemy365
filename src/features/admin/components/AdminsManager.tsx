'use client'

import { useActionState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Shield, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { createAdminUser } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'
import type { ActionResult } from '@/lib/errors'

interface AdminUserRecord {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

interface AdminsManagerProps {
  initialAdmins: AdminUserRecord[]
}

export function AdminsManager({ initialAdmins }: AdminsManagerProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, isPending] = useActionState(
    async (_prevState: ActionResult | null, formData: FormData) => {
      const res = await createAdminUser(formData)
      if (res.success) {
        formRef.current?.reset()
        router.refresh()
      }
      return res
    },
    null
  )

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Create New Admin Form */}
      <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-[#EDE7FB] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#7C3AED]">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#4C1D95]">
              إضافة حساب مدير جديد
            </h2>
            <p className="text-xs text-[#6B5B95]">
              أدخل البريد وكلمة المرور لإتاحة الدخول لهذا الحساب في لوحة التحكم
            </p>
          </div>
        </div>

        {state?.success && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#EDE7FB] p-3 text-xs font-bold text-[#4C1D95]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#7C3AED]" />
            <span>تمت إضافة حساب المدير بنجاح في قاعدة البيانات.</span>
          </div>
        )}

        {state && !state.success && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{state.error}</span>
          </div>
        )}

        <form ref={formRef} action={formAction} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="full_name" className="text-xs font-bold text-[#4C1D95]">
                اسم المدير
              </Label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#6B5B95]">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="مثال: أحمد محمد"
                  disabled={isPending}
                  className="pr-9 border-[#EDE7FB] focus-visible:ring-[#7C3AED] text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" required className="text-xs font-bold text-[#4C1D95]">
                البريد الإلكتروني
              </Label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#6B5B95]">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  disabled={isPending}
                  className="pr-9 border-[#EDE7FB] focus-visible:ring-[#7C3AED] text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" required className="text-xs font-bold text-[#4C1D95]">
                كلمة المرور
              </Label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#6B5B95]">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                  className="pr-9 border-[#EDE7FB] focus-visible:ring-[#7C3AED] text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              size="md"
              isLoading={isPending}
              disabled={isPending}
              className="font-bold text-xs"
            >
              <UserPlus className="ml-1.5 h-4 w-4" />
              <span>إضافة المدير الآن</span>
            </Button>
          </div>
        </form>
      </div>

      {/* List of Registered Admins */}
      <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#EDE7FB] pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="text-base font-bold text-[#4C1D95]">
              حسابات المدراء المسجلين ({initialAdmins.length})
            </h2>
          </div>
          <span className="text-xs text-[#6B5B95]">
            تظهر هذه البيانات مباشرة من جدول `admin_users`
          </span>
        </div>

        <div className="mt-4 divide-y divide-[#EDE7FB]">
          {initialAdmins.length === 0 ? (
            <p className="py-6 text-center text-xs text-[#6B5B95]">
              لا توجد حسابات مدراء مسجلة في جدول admin_users.
            </p>
          ) : (
            initialAdmins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between py-3.5 px-2 hover:bg-[#F8F5FF] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#7C3AED]">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#4C1D95]">
                        {admin.full_name || 'مدير المنصة'}
                      </span>
                      <span className="rounded-full bg-[#EDE7FB] px-2 py-0.5 text-[10px] font-bold text-[#7C3AED]">
                        مدير معتمد
                      </span>
                    </div>
                    <span className="text-xs text-[#6B5B95]">{admin.email}</span>
                  </div>
                </div>

                <div className="text-left text-xs text-[#6B5B95]">
                  <span>تاريخ الإضافة: {formatDate(admin.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
