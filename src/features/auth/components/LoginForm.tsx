'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import { login } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Mail, AlertCircle } from 'lucide-react'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      return await login(formData)
    },
    null
  )

  return (
    <div className="w-full max-w-md rounded-3xl border border-[#EDE7FB] bg-white p-8 sm:p-10 shadow-lg">
      <div className="text-center">
        <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-2xl border-2 border-[#EDE7FB] bg-white shadow-xs p-1">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-[#4C1D95]">
          لوحة تحكم تعلّمي 365
        </h1>
        <p className="mt-1 text-xs text-[#6B5B95]">
          تسجيل الدخول لإدارة المناهج والكورسات واستفسارات الطلاب
        </p>
      </div>

      {state && !state.success && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <p className="font-bold">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email" required className="font-bold text-[#4C1D95]">
            البريد الإلكتروني للإدارة
          </Label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6B5B95]">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Talemy365.eg@gmail.com"
              required
              disabled={isPending}
              className="pr-10 border-[#EDE7FB] focus-visible:ring-[#7C3AED]"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" required className="font-bold text-[#4C1D95]">
            كلمة المرور
          </Label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6B5B95]">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              required
              disabled={isPending}
              className="pr-10 border-[#EDE7FB] focus-visible:ring-[#7C3AED]"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full text-base font-bold"
            isLoading={isPending}
            disabled={isPending}
          >
            تسجيل الدخول
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-[#EDE7FB] pt-4 text-center">
        <p className="text-xs text-[#6B5B95]">
          منطقة آمنة ومحمية خاصة بإدارة المؤسسة فقط.
        </p>
      </div>
    </div>
  )
}
